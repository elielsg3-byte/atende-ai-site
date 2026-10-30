// Conteúdo do e-mail de boas-vindas. Edite os textos aqui.
// Enquanto existir "{{PREENCHER" em algum texto, o envio é bloqueado (para não sair e-mail incompleto).

const SITE = 'https://atendeaidelivery.com.br';

// ---- Próximos passos (iguais para todos os planos) ----------------------
export const NEXT_STEPS = [
  { title: '{{PREENCHER: passo 1}}', text: '{{PREENCHER: o que o cliente faz primeiro, ex.: chamar no WhatsApp e enviar o cardápio}}' },
  { title: '{{PREENCHER: passo 2}}', text: '{{PREENCHER: o que a equipe faz e em quanto tempo}}' },
  { title: '{{PREENCHER: passo 3}}', text: '{{PREENCHER: quando a funcionária digital entra no ar}}' },
];

// Rascunho usado só nos e-mails de TESTE enquanto os textos acima não forem preenchidos.
const DRAFT_STEPS = [
  { title: 'Sua vaga de fundador está garantida', text: 'Você já está na lista de fundadores, com acesso garantido à plataforma.' },
  { title: 'Convite de acesso por e-mail', text: 'Quando a plataforma abrir, o convite chega neste e-mail. Fique de olho também na caixa de spam.' },
  { title: 'Implantação junto com você', text: 'Com o convite em mãos, configuramos sua funcionária digital para a sua loja.' },
];

export const CTA = {
  label: 'Falar com a equipe',
  url: '{{PREENCHER: link do WhatsApp, ex.: https://wa.me/5543999999999}}',
};

// ---- Planos ---------------------------------------------------------------
const PLANS = {
  basic: {
    key: 'basic',
    name: 'Founder Basic',
    subject: 'Bem-vindo(a) ao lote de fundador da Atende.AI',
    intro: 'Seu pagamento foi aprovado e o seu Founder Basic está garantido no lote de fundador.',
    items: [
      'Funcionária digital atendendo no WhatsApp 24h',
      'Pedidos anotados completos, sem erro',
      'DeliveryHUB, o painel de pedidos da loja',
      'Pagamento único, sem mensalidade',
    ],
  },
  pro: {
    key: 'pro',
    name: 'Founder PRO',
    subject: 'Bem-vindo(a) ao Founder PRO da Atende.AI',
    intro: 'Seu pagamento foi aprovado e o seu Founder PRO está garantido no lote de fundador.',
    items: [
      'Funcionária digital sem limite de atendimentos',
      'DeliveryHUB completo, o painel de pedidos da loja',
      'Comanda digital e impressão dos pedidos',
      'Clube-Founder',
      'Pagamento único, sem mensalidade',
    ],
  },
  upgrade: {
    key: 'upgrade',
    name: 'Founder PRO',
    subject: 'Upgrade confirmado: agora você é Founder PRO',
    intro: 'Seu upgrade foi aprovado e seu plano agora é o Founder PRO. Este e-mail substitui as informações do Founder Basic que você recebeu antes.',
    items: [
      'Funcionária digital sem limite de atendimentos',
      'DeliveryHUB completo',
      'Comanda digital e impressão dos pedidos',
      'Clube-Founder',
    ],
  },
};

// Identifica o plano pelo produto/oferta da Cakto (short_id do link de checkout, depois pelo nome).
const SHORT_IDS = { p3rgmzw: 'basic', fwrej9i: 'pro' };
export function resolvePlan(data = {}) {
  const product = data.product || {};
  const offer = data.offer || {};
  const ids = [product.short_id, product.id, offer.id, offer.short_id].map(v => String(v || '').toLowerCase());
  for (const id of ids) for (const [sid, key] of Object.entries(SHORT_IDS)) if (id && id.startsWith(sid)) return PLANS[key];
  const name = `${product.name || ''} ${offer.name || ''}`.toLowerCase();
  if (/upgrade/.test(name)) return PLANS.upgrade;
  if (/pro\b|pro$/.test(name)) return PLANS.pro;
  return PLANS.basic;
}

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function isConfigured() {
  return !JSON.stringify({ NEXT_STEPS, CTA, PLANS }).includes('{{PREENCHER');
}

export function buildWelcomeEmail({ firstName = '', plan = PLANS.basic, orderId = '', draft = false } = {}) {
  const steps_ = draft && !isConfigured() ? DRAFT_STEPS : NEXT_STEPS;
  const showCta = !String(CTA.url).includes('{{PREENCHER');
  const hello = firstName ? `Olá, ${esc(firstName)}!` : 'Olá!';
  const F = "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;";

  const items = plan.items.map(i => `
              <tr>
                <td valign="top" style="width:30px;padding:7px 0"><div style="width:20px;height:20px;border-radius:10px;background:#BAF91A;color:#08351F;text-align:center;${F}font-size:13px;line-height:20px;font-weight:700">&#10003;</div></td>
                <td style="padding:7px 0;${F}font-size:15px;line-height:21px;color:#12201A">${esc(i)}</td>
              </tr>`).join('');

  const steps = steps_.map((s, n) => `
              <tr>
                <td valign="top" style="width:40px;padding:10px 0">
                  <div style="width:30px;height:30px;border-radius:15px;background:#08351F;color:#BAF91A;text-align:center;${F}font-size:14px;line-height:30px;font-weight:700">${n + 1}</div>
                </td>
                <td style="padding:10px 0;${F}">
                  <div style="font-size:15px;line-height:20px;font-weight:700;color:#12201A">${esc(s.title)}</div>
                  <div style="font-size:14px;line-height:21px;color:#4E5B54;margin-top:2px">${esc(s.text)}</div>
                </td>
              </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><title>${esc(plan.subject)}</title></head>
<body style="margin:0;padding:0;background:#EEF1EC">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(plan.intro)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF1EC">
  <tr><td align="center" style="padding:28px 12px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
      <!-- topo -->
      <tr><td style="background:#08351F;border-radius:20px 20px 0 0;padding:26px 28px 24px">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td><img src="${SITE}/assets/email/logo.png" width="40" height="40" alt="" style="display:block;border:0"></td>
          <td style="padding-left:12px;${F}font-size:20px;font-weight:700;color:#FFFFFF;letter-spacing:-0.3px">Atende<span style="color:#BAF91A">.AI</span></td>
        </tr></table>
        <div style="margin-top:26px;display:inline-block;background:#BAF91A;color:#08351F;border-radius:999px;padding:6px 14px;${F}font-size:11px;font-weight:700;letter-spacing:1.6px">${esc(plan.name.toUpperCase())} &middot; LOTE DE FUNDADOR</div>
        <div style="margin-top:14px;${F}font-size:28px;line-height:34px;font-weight:700;color:#FFFFFF;letter-spacing:-0.6px">${hello}<br>Pagamento aprovado.</div>
        <div style="margin-top:10px;${F}font-size:15px;line-height:23px;color:#CFE3D6">${esc(plan.intro)}</div>
      </td></tr>
      <!-- corpo -->
      <tr><td style="background:#FFFFFF;padding:26px 28px 8px">
        <div style="${F}font-size:12px;font-weight:700;letter-spacing:1.4px;color:#6B7A72">O QUE VOCÊ GARANTIU</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px">${items}
        </table>
      </td></tr>
      <tr><td style="background:#FFFFFF;padding:18px 28px 8px">
        <div style="height:1px;background:#E6EAE6"></div>
        <div style="margin-top:22px;${F}font-size:12px;font-weight:700;letter-spacing:1.4px;color:#6B7A72">PRÓXIMOS PASSOS</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px">${steps}
        </table>
      </td></tr>
      <tr><td align="center" style="background:#FFFFFF;padding:${showCta ? '18px' : '4px'} 28px 30px;border-radius:0 0 20px 20px">
        ${showCta ? `<a href="${esc(CTA.url)}" style="display:inline-block;background:#08351F;color:#FFFFFF;text-decoration:none;border-radius:14px;padding:15px 26px;${F}font-size:15px;font-weight:700">${esc(CTA.label)} &rarr;</a>` : ''}
        ${orderId ? `<div style="margin-top:16px;${F}font-size:12px;color:#8A968F">Pedido ${esc(orderId)}</div>` : ''}
      </td></tr>
      <!-- rodapé -->
      <tr><td align="center" style="padding:20px 20px 0;${F}font-size:12px;line-height:18px;color:#7D8A83">
        Você recebeu este e-mail porque comprou o ${esc(plan.name)} da Atende.AI.<br>
        <a href="${SITE}" style="color:#08351F;text-decoration:none;font-weight:700">atendeaidelivery.com.br</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  const text = [
    `${firstName ? `Olá, ${firstName}!` : 'Olá!'} Pagamento aprovado.`,
    '',
    plan.intro,
    '',
    'O que você garantiu:',
    ...plan.items.map(i => `- ${i}`),
    '',
    'Próximos passos:',
    ...steps_.map((s, n) => `${n + 1}. ${s.title}: ${s.text}`),
    '',
    showCta ? `${CTA.label}: ${CTA.url}` : '',
    orderId ? `\nPedido ${orderId}` : '',
    '',
    'Atende.AI - atendeaidelivery.com.br',
  ].join('\n');

  return { subject: plan.subject, html, text };
}
