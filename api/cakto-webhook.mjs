// Cakto -> Resend: e-mail de boas-vindas após compra aprovada.
//
// Variáveis de ambiente (Vercel > Settings > Environment Variables):
//   RESEND_API_KEY         chave do Resend (re_...)
//   CAKTO_WEBHOOK_SECRET   o "secret" do webhook cadastrado na Cakto
//   EMAIL_FROM             opcional. Padrão: "Atende.AI <contato@atendeaidelivery.com.br>"
//   EMAIL_REPLY_TO         opcional. Para onde vão as respostas do cliente
//   EMAIL_BCC              opcional. Recebe uma cópia de cada e-mail enviado (controle interno)
import crypto from 'node:crypto';
import { buildWelcomeEmail, resolvePlan, isConfigured } from '../lib/welcome-email.mjs';

const MAX_SIGNATURE_AGE_S = 60 * 60; // aceita até 1h de diferença (cobre as retentativas da Cakto)

function safeEqual(a, b) {
  const x = Buffer.from(String(a || ''));
  const y = Buffer.from(String(b || ''));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function verify(raw, body, headers, secret) {
  const sigHeader = headers.get('x-cakto-signature');
  const ts = headers.get('x-cakto-timestamp');
  if (sigHeader && ts) {
    const age = Math.abs(Date.now() / 1000 - Number(ts));
    if (!Number.isFinite(age) || age > MAX_SIGNATURE_AGE_S) return false;
    const expected = 'v1=' + crypto.createHmac('sha256', secret).update(`${ts}.${raw}`).digest('hex');
    return safeEqual(sigHeader.trim(), expected);
  }
  // fallback: secret enviado no corpo
  return safeEqual(body && body.secret, secret);
}

const json = (status, obj) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

export async function GET() {
  return json(200, { ok: true, service: 'cakto-webhook' });
}

export async function POST(request) {
  const secret = process.env.CAKTO_WEBHOOK_SECRET;
  const apiKey = process.env.RESEND_API_KEY;
  if (!secret || !apiKey) return json(500, { error: 'missing_env' });
  if (!isConfigured()) return json(500, { error: 'email_not_configured' });

  const raw = await request.text();
  let body;
  try { body = JSON.parse(raw); } catch { return json(400, { error: 'invalid_json' }); }

  if (!verify(raw, body, request.headers, secret)) return json(401, { error: 'invalid_signature' });

  // Só e-mail de boas-vindas em compra aprovada; os outros eventos são confirmados e ignorados.
  if (body.event !== 'purchase_approved') return json(200, { ignored: body.event || null });

  const data = Array.isArray(body.data) ? body.data[0] : body.data; // V2 envia array
  const customer = (data && data.customer) || {};
  if (!customer.email) return json(200, { ignored: 'no_customer_email' });

  const plan = resolvePlan(data);
  const email = buildWelcomeEmail({
    firstName: String(customer.name || '').trim().split(/\s+/)[0] || '',
    plan,
    orderId: data.id || data.refId || '',
  });

  const payload = {
    from: process.env.EMAIL_FROM || 'Atende.AI <contato@atendeaidelivery.com.br>',
    to: [customer.email],
    subject: email.subject,
    html: email.html,
    text: email.text,
    tags: [{ name: 'tipo', value: 'boas-vindas' }, { name: 'plano', value: plan.key }],
  };
  if (process.env.EMAIL_REPLY_TO) payload.reply_to = process.env.EMAIL_REPLY_TO;
  if (process.env.EMAIL_BCC) payload.bcc = [process.env.EMAIL_BCC];

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      // a Cakto pode reenviar o mesmo evento: o Resend ignora repetições com a mesma chave (24h)
      'Idempotency-Key': `boas-vindas-${data.id || customer.email}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error('resend_error', res.status, detail);
    return json(502, { error: 'resend_error', status: res.status });
  }
  const sent = await res.json();
  return json(200, { sent: true, plan: plan.key, id: sent.id });
}
