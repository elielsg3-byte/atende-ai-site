// Proxy protegido do site -> luna-api (teste da Luna, FAQ e leads do "Monte sua Luna").
//
// O que ele faz antes de gastar uma chamada de IA:
//   - aceita só POST com JSON pequeno, vindo das páginas do próprio site (Origin);
//   - conta as mensagens do cliente aqui no servidor (o navegador não decide mais o limite);
//   - limita tamanho do histórico, de cada mensagem e do estado;
//   - valida e limpa os leads, e descarta envios de robôs (campo isca + tempo mínimo);
//   - repassa para o luna-api com um cabeçalho secreto. O firewall do luna-api recusa
//     qualquer chamada sem esse cabeçalho, então ninguém usa a API direto.
//
// Variáveis de ambiente (Vercel > Settings > Environment Variables):
//   LUNA_PROXY_SECRET   segredo enviado no cabeçalho x-luna-proxy (obrigatório)
//   LUNA_API_URL        opcional. Padrão: https://luna-api-atende-ai-site.vercel.app/api/luna

export const maxDuration = 45;

const UPSTREAM = process.env.LUNA_API_URL || 'https://luna-api-atende-ai-site.vercel.app/api/luna';
const ALLOWED_HOSTS = ['atendeaidelivery.com.br', 'www.atendeaidelivery.com.br'];
const NICHES = ['pizzaria', 'hamburgueria', 'acai', 'marmitaria'];
const ENGINES = ['gemini', 'mistral'];

const MAX_BODY = 32 * 1024;      // bytes
const MAX_USER_MSGS = 14;        // mesmo limite da página
const MAX_HISTORY = 40;          // itens no histórico
const MAX_USER_CHARS = 500;
const MAX_MODEL_CHARS = 2500;
const MAX_STATE = 8 * 1024;      // bytes do estado do pedido
const MAX_FAQ_CHARS = 300;
const MIN_LEAD_MS = 2500;        // humano não preenche o formulário em menos de 2,5 s

const json = (status, obj) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

function originOk(request) {
  const origin = request.headers.get('origin') || '';
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname.toLowerCase();
    if (ALLOWED_HOSTS.includes(host)) return true;
    // prévias da própria Vercel deste projeto
    return /^atende-ai-site[a-z0-9-]*\.vercel\.app$/.test(host);
  } catch { return false; }
}

const str = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

function cleanLead(lead) {
  if (!lead || typeof lead !== 'object') return null;
  const out = {};
  const fields = {
    origem: 40, plano: 10, loja: 80, atendente: 40, atendente_tipo: 20, quando: 60,
    computador: 60, ajuda: 80, nicho_demo: 20, aparelho: 20,
  };
  for (const [k, max] of Object.entries(fields)) if (lead[k] != null) out[k] = str(lead[k], max);
  const digits = String(lead.whatsapp || '').replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 13) return null;
  out.whatsapp = digits;
  if (!out.loja || out.loja.length < 2) return null;
  // objetos pequenos (respostas do quiz e UTMs): só textos curtos, no máximo 20 chaves
  for (const k of ['quiz', 'utm']) {
    const src = lead[k];
    if (src && typeof src === 'object' && !Array.isArray(src)) {
      out[k] = Object.fromEntries(Object.entries(src).slice(0, 20).map(([a, b]) => [str(a, 40), str(b, 160)]));
    }
  }
  return out;
}

function cleanChat(body) {
  const niche = NICHES.includes(body.niche) ? body.niche : null;
  if (!niche) return { error: 'invalid_niche' };
  const engine = ENGINES.includes(body.engine) ? body.engine : 'gemini';
  if (!Array.isArray(body.history)) return { error: 'invalid_history' };
  const history = body.history.slice(-MAX_HISTORY).map(m => {
    if (!m || (m.role !== 'user' && m.role !== 'model')) return null;
    return { role: m.role, text: String(m.text == null ? '' : m.text).slice(0, m.role === 'user' ? MAX_USER_CHARS : MAX_MODEL_CHARS) };
  }).filter(Boolean);
  if (!history.length || history[history.length - 1].role !== 'user') return { error: 'invalid_history' };
  // o limite é contado aqui, no servidor, a partir do histórico (não do número enviado pelo navegador)
  const userMsgs = history.filter(m => m.role === 'user').length;
  if (userMsgs > MAX_USER_MSGS + 1) return { limit: true };
  let state = body.state && typeof body.state === 'object' ? body.state : {};
  if (JSON.stringify(state).length > MAX_STATE) return { error: 'state_too_large' };
  // a página abre a conversa com uma mensagem automática ("Oi, quero ver o cardápio") que não conta
  const seeded = history[0] && history[0].role === 'user' && history[0].text === 'Oi, quero ver o cardápio' ? 1 : 0;
  return { payload: { niche, engine, history, state, count: Math.max(1, userMsgs - seeded) } };
}

export async function GET() {
  return json(405, { error: 'method_not_allowed' });
}

export async function POST(request) {
  const secret = process.env.LUNA_PROXY_SECRET;
  if (!secret) return json(503, { error: 'not_configured' });
  if (!originOk(request)) return json(403, { error: 'forbidden' });
  if (!/application\/json/i.test(request.headers.get('content-type') || '')) return json(415, { error: 'unsupported_media_type' });

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json(413, { error: 'payload_too_large' });
  let body;
  try { body = JSON.parse(raw); } catch { return json(400, { error: 'invalid_json' }); }
  if (!body || typeof body !== 'object') return json(400, { error: 'invalid_body' });

  let payload;
  if (body.mode === 'faq') {
    const question = str(body.question, MAX_FAQ_CHARS);
    if (!question) return json(400, { error: 'invalid_question' });
    payload = { mode: 'faq', question };
  } else if (body.mode === 'lead') {
    // robôs: preenchem o campo isca ou enviam rápido demais. Responde "ok" sem repassar nada.
    if (body.hp || (Number(body.elapsed) > 0 && Number(body.elapsed) < MIN_LEAD_MS)) return json(200, { ok: true });
    const lead = cleanLead(body.lead);
    if (!lead) return json(400, { error: 'invalid_lead' });
    payload = { mode: 'lead', lead };
  } else {
    const c = cleanChat(body);
    if (c.limit) return json(200, { limit: true, replies: [] });
    if (c.error) return json(400, { error: c.error });
    payload = c.payload;
  }

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim();
  let res;
  try {
    res = await fetch(UPSTREAM, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-luna-proxy': secret,
        ...(ip ? { 'x-luna-client-ip': ip } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(40000),
    });
  } catch (err) {
    console.error('luna_upstream_error', err && err.message);
    return json(502, { error: 'upstream_unavailable' });
  }
  const text = await res.text();
  if (!/json/i.test(res.headers.get('content-type') || '')) {
    console.error('luna_upstream_non_json', res.status);
    return json(502, { error: 'upstream_invalid' });
  }
  return new Response(text, { status: res.status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}
