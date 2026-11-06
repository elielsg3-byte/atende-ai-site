// Meta API de Conversões: envia o evento Purchase do lado do servidor quando a Cakto aprova uma venda.
//
// Variáveis de ambiente (Vercel > Settings > Environment Variables):
//   META_CAPI_TOKEN        token gerado em Gerenciador de Eventos > pixel > Configurações > API de Conversões
//   META_PIXEL_ID          opcional. Padrão: 1444232587293553
//   META_TEST_EVENT_CODE   opcional. Código da aba "Testar eventos" (TEST1234). Remova depois do teste.
//
// O event_id é o id do pedido na Cakto. Se a Cakto também mandar o Purchase pelo navegador com o mesmo id,
// o Meta junta os dois e conta uma compra só.
import crypto from 'node:crypto';

const DEFAULT_PIXEL = '1444232587293553';
const PLAN_VALUE = { basic: 97, pro: 167, upgrade: 70 };

const sha = v => crypto.createHash('sha256').update(v).digest('hex');
const norm = v => String(v || '').trim().toLowerCase();

function phoneDigits(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.length <= 11) d = '55' + d; // número brasileiro sem DDI
  return d;
}

// A Cakto às vezes manda o valor em reais (97) e às vezes em centavos (9700). Usa o valor do plano como referência.
function resolveValue(data, planKey) {
  const ref = PLAN_VALUE[planKey];
  const candidates = [data.amount, data.paidAmount, data.baseAmount, data.price, data.offer && data.offer.price]
    .map(Number).filter(n => Number.isFinite(n) && n > 0);
  for (const n of candidates) {
    if (ref && Math.abs(n - ref) <= ref * 0.6) return Math.round(n * 100) / 100;
    if (ref && Math.abs(n / 100 - ref) <= ref * 0.6) return Math.round(n) / 100;
  }
  return ref || (candidates[0] || 0);
}

function pick(obj, keys) {
  for (const k of keys) {
    const v = k.split('.').reduce((o, p) => (o && o[p] !== undefined ? o[p] : undefined), obj);
    if (v) return String(v);
  }
  return '';
}

export function isCapiConfigured() {
  return Boolean(process.env.META_CAPI_TOKEN);
}

export async function sendPurchase(data, plan) {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return { skipped: 'no_token' };
  const pixel = process.env.META_PIXEL_ID || DEFAULT_PIXEL;
  const customer = data.customer || {};

  const [first = '', ...rest] = norm(customer.name).split(/\s+/);
  const userData = {};
  if (customer.email) userData.em = [sha(norm(customer.email))];
  const ph = phoneDigits(customer.phone || customer.cellphone);
  if (ph) userData.ph = [sha(ph)];
  if (first) userData.fn = [sha(first)];
  if (rest.length) userData.ln = [sha(rest[rest.length - 1])];
  if (customer.email) userData.external_id = [sha(norm(customer.email))];
  const fbc = pick(data, ['fbc', 'tracking.fbc', 'utm.fbc', 'metadata.fbc']);
  const fbp = pick(data, ['fbp', 'tracking.fbp', 'utm.fbp', 'metadata.fbp']);
  const fbclid = pick(data, ['fbclid', 'tracking.fbclid', 'utm.fbclid', 'metadata.fbclid']);
  if (fbc) userData.fbc = fbc;
  else if (fbclid) userData.fbc = `fb.1.${Date.now()}.${fbclid}`;
  if (fbp) userData.fbp = fbp;
  const ip = pick(data, ['ip', 'customer.ip', 'client_ip']);
  if (ip) userData.client_ip_address = ip;

  const orderId = String(data.id || data.refId || '');
  const paidAt = Date.parse(data.paidAt || data.paid_at || data.updatedAt || '') || Date.now();
  const body = {
    data: [{
      event_name: 'Purchase',
      event_time: Math.floor(Math.min(paidAt, Date.now()) / 1000),
      event_id: orderId || undefined,
      action_source: 'website',
      event_source_url: 'https://www.atendeaidelivery.com.br/',
      user_data: userData,
      custom_data: {
        currency: 'BRL',
        value: resolveValue(data, plan && plan.key),
        content_type: 'product',
        content_ids: [plan && plan.key === 'pro' ? 'founder-pro' : plan && plan.key === 'upgrade' ? 'founder-upgrade' : 'founder-basic'],
        content_name: plan ? plan.name : '',
        order_id: orderId || undefined,
      },
    }],
  };
  if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;

  const res = await fetch(`https://graph.facebook.com/v21.0/${pixel}/events?access_token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('meta_capi_error', res.status, JSON.stringify(out));
    return { ok: false, status: res.status };
  }
  return { ok: true, received: out.events_received };
}
