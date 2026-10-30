// E-mails de boas-vindas (lista de espera). Edite os textos aqui.
// Enquanto o link do pré-cadastro tiver "{{PREENCHER", o envio para compras reais fica bloqueado.

const SITE = 'https://atendeaidelivery.com.br';
const IMG = `${SITE}/assets/email`;

export const CTA = {
  label: 'Fazer meu pré-cadastro',
  url: '{{PREENCHER: link do pré-cadastro}}',
};

const WAIT_INTRO = 'Com a alta procura pelo lote de fundadores, a entrada das lojas está acontecendo de forma coordenada e acompanhada pela nossa equipe de implementação, por ordem de compra.';
const STEP_INVITE = { title: 'Receba o convite de acesso', text: 'O convite chega neste e-mail. Vale olhar também a caixa de spam e a aba Promoções.' };

// ---- Planos ---------------------------------------------------------------
const PLANS = {
  basic: {
    key: 'basic', theme: 'basic', name: 'Founder Basic', hero: 'hero-basic.jpg',
    heroAlt: 'Founder Basic: bem-vindo(a) ao lote de fundadores. Pagamento aprovado.',
    subject: 'Bem-vindo(a) à Atende.AI, sua vaga de fundador está garantida',
    preheader: 'Seu lugar na fila já está reservado. Veja os próximos passos.',
    hello: n => `Olá, ${n || ''}! Seja bem-vindo(a) à Atende.AI.`.replace(', !', '!'),
    intro: 'Seu pagamento foi aprovado e você agora faz parte do lote de fundadores. É um grupo pequeno de lojas que vai usar a funcionária digital antes de todo mundo, pelo valor que nunca mais vai se repetir.',
    itemsTitle: 'O que muda na sua loja',
    items: [
      'Seu WhatsApp responde na hora, 24h por dia, inclusive quando você está na chapa',
      'Os pedidos chegam completos, com observações e endereço, sem nada anotado errado',
      'Você acompanha tudo pelo DeliveryHUB, o painel de pedidos da loja',
      'Pagamento único, sem mensalidade',
    ],
    steps: [
      { title: 'Faça seu pré-cadastro', text: 'Seus dados ficam prontos para quando chegar a vez da sua loja.' },
      STEP_INVITE,
      { title: 'Sua funcionária digital entra no ar', text: 'Configuramos tudo com você: cardápio, horários e taxas da sua loja.' },
    ],
    wait: [WAIT_INTRO, '<b>Seu lugar já está reservado</b>, e o acesso chega em 6 a 30 dias após o pré-cadastro.'],
    footer: 'Você recebeu este e-mail porque comprou o Founder Basic da Atende.AI.',
  },
  pro: {
    key: 'pro', theme: 'pro', name: 'Founder PRO', hero: 'hero-pro.jpg',
    heroAlt: 'Founder PRO: bem-vindo(a) ao Founder PRO. Pagamento aprovado.',
    subject: 'Bem-vindo(a) ao Founder PRO, sua loja vai na frente',
    preheader: 'Você garantiu a experiência completa da Atende.AI. Veja os próximos passos.',
    hello: n => `Olá, ${n || ''}! Seja bem-vindo(a) ao Founder PRO.`.replace(', !', '!'),
    intro: 'Seu pagamento foi aprovado e você garantiu a experiência completa da Atende.AI, no plano mais alto do lote de fundadores.',
    itemsTitle: 'O que você liberou',
    items: [
      'Atendimento sem limite: no pico de sexta à noite, todos os clientes são respondidos ao mesmo tempo',
      'Entende áudio e reconhece quem já comprou antes, para atender cada cliente pelo nome',
      'DeliveryHUB completo, com relatórios e histórico para você enxergar a loja de verdade',
      'Comanda digital e impressão automática dos pedidos na cozinha',
      'Clube-Founder',
      'Pagamento único, sem mensalidade',
    ],
    steps: [
      { title: 'Faça seu pré-cadastro', text: 'Seus dados ficam prontos para quando chegar a vez da sua loja.' },
      STEP_INVITE,
      { title: 'Sua funcionária digital entra no ar', text: 'Configuramos tudo com você: cardápio, horários, taxas e impressora.' },
    ],
    wait: [WAIT_INTRO, '<b>Seu lugar já está reservado</b>, e como Founder PRO sua loja tem prioridade na fila. O acesso chega em 6 a 30 dias após o pré-cadastro.'],
    footer: 'Você recebeu este e-mail porque comprou o Founder PRO da Atende.AI.',
  },
  upgrade: {
    key: 'upgrade', theme: 'pro', name: 'Founder PRO', hero: 'hero-upgrade.jpg',
    heroAlt: 'Upgrade confirmado: agora você é Founder PRO.',
    subject: 'Upgrade confirmado, agora você é Founder PRO',
    preheader: 'Este e-mail substitui o anterior. Veja tudo o que você liberou.',
    hello: n => `Olá, ${n || ''}! Upgrade confirmado.`.replace(', !', '!'),
    intro: 'Seu plano agora é o Founder PRO. Este e-mail substitui as informações do Founder Basic que você recebeu antes.',
    itemsTitle: 'O que você ganhou com o upgrade',
    items: [
      'Atendimento sem limite, no lugar do limite de clientes simultâneos do Basic',
      'Entende áudio e reconhece quem já comprou antes',
      'DeliveryHUB completo, com relatórios e histórico',
      'Comanda digital e impressão automática dos pedidos',
      'Clube-Founder',
      'Prioridade na implantação e acesso antecipado às novas versões',
    ],
    steps: [
      { title: 'Faça seu pré-cadastro', text: 'Se você já fez pelo e-mail anterior, não precisa repetir.' },
      STEP_INVITE,
      { title: 'Sua funcionária digital entra no ar', text: 'Configuramos tudo com você: cardápio, horários, taxas e impressora.' },
    ],
    wait: [WAIT_INTRO, '<b>Seu lugar já está reservado</b>, e com o upgrade sua loja passou para a frente da fila. O acesso chega em 6 a 30 dias após o pré-cadastro.'],
    footer: 'Você recebeu este e-mail porque comprou o upgrade para o Founder PRO da Atende.AI.',
  },
};

// ---- Temas (Basic = simples e claro / PRO = premium escuro) ---------------
const THEMES = {
  basic: {
    page: '#EDF1E9', card: '#FFFFFF', border: '#E1E7DD', text: '#12201A', muted: '#4E5B54', label: '#5F7A2A',
    checkBg: '#BAF91A', checkFg: '#08351F', numBg: '#08351F', numFg: '#BAF91A',
    waitBg: '#F5FBE6', waitBorder: '#DCEFB0', waitLabel: '#4D7A0E',
    btnBg: '#BAF91A', btnFg: '#08351F', divider: '#E6EAE6', footer: '#7D8A83', link: '#08351F', scheme: 'light',
  },
  pro: {
    page: '#030604', card: '#0A110D', border: '#1A2A21', text: '#EEF5F0', muted: '#A7B6AD', label: '#7EE8A4',
    checkBg: '#123522', checkFg: '#5BE38B', numBg: '#E6F4EA', numFg: '#0B3B22',
    waitBg: '#0E1B14', waitBorder: '#244332', waitLabel: '#7EE8A4',
    btnBg: '#E6F4EA', btnFg: '#0B3B22', divider: '#1A2A21', footer: '#6F7E75', link: '#9BE9B6', scheme: 'dark',
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
// texto com <b> permitido (só o que escrevemos aqui, nunca dado do cliente)
const rich = s => esc(s).replace(/&lt;b&gt;/g, '<strong>').replace(/&lt;\/b&gt;/g, '</strong>');

export function isConfigured() {
  return !String(CTA.url).includes('{{PREENCHER');
}

export function buildWelcomeEmail({ firstName = '', plan = PLANS.basic, orderId = '', draft = false } = {}) {
  const t = THEMES[plan.theme];
  const ctaUrl = isConfigured() ? CTA.url : (draft ? SITE : CTA.url);
  const F = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;";
  const label = txt => `<div style="${F}font-size:12px;line-height:16px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${t.label}">${esc(txt)}</div>`;

  const items = plan.items.map(i => `
          <tr>
            <td valign="top" width="34" style="padding:8px 0;width:34px">
              <div style="width:22px;height:22px;border-radius:11px;background:${t.checkBg};color:${t.checkFg};text-align:center;${F}font-size:13px;line-height:22px;font-weight:800">&#10003;</div>
            </td>
            <td style="padding:8px 0;${F}font-size:16px;line-height:23px;color:${t.text}">${esc(i)}</td>
          </tr>`).join('');

  const steps = plan.steps.map((s, n) => `
          <tr>
            <td valign="top" width="46" style="padding:10px 0;width:46px">
              <div style="width:32px;height:32px;border-radius:16px;background:${t.numBg};color:${t.numFg};text-align:center;${F}font-size:15px;line-height:32px;font-weight:800">${n + 1}</div>
            </td>
            <td style="padding:10px 0;${F}">
              <div style="font-size:16px;line-height:22px;font-weight:700;color:${t.text}">${esc(s.title)}</div>
              <div style="font-size:15px;line-height:22px;color:${t.muted};margin-top:2px">${esc(s.text)}</div>
            </td>
          </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="${t.scheme}">
<meta name="supported-color-schemes" content="${t.scheme}">
<title>${esc(plan.subject)}</title>
<style>
  body{margin:0;padding:0;-webkit-text-size-adjust:100%;}
  img{border:0;outline:none;text-decoration:none;}
  @media (max-width:620px){
    .wrap{padding:0 !important;}
    .px{padding-left:20px !important;padding-right:20px !important;}
    .card{border-radius:0 !important;border-left:0 !important;border-right:0 !important;}
    .hero{border-radius:0 !important;}
    .h1{font-size:23px !important;line-height:30px !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:${t.page}" bgcolor="${t.page}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">${esc(plan.preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${t.page}" style="background:${t.page}">
  <tr><td align="center" class="wrap" style="padding:24px 12px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%">

      <tr><td class="card" style="background:${t.card};border:1px solid ${t.border};border-radius:22px;overflow:hidden" bgcolor="${t.card}">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <!-- topo -->
          <tr><td style="padding:0;line-height:0;font-size:0">
            <img class="hero" src="${IMG}/${plan.hero}" width="600" alt="${esc(plan.heroAlt)}" style="display:block;width:100%;max-width:600px;height:auto;border-radius:22px 22px 0 0;background:${t.page}">
          </td></tr>

          <!-- saudação -->
          <tr><td class="px" style="padding:30px 32px 6px">
            <div class="h1" style="${F}font-size:26px;line-height:33px;font-weight:800;letter-spacing:-0.4px;color:${t.text}">${esc(plan.hello(firstName))}</div>
            <div style="${F}font-size:16px;line-height:25px;color:${t.muted};margin-top:12px">${esc(plan.intro)}</div>
          </td></tr>

          <!-- benefícios -->
          <tr><td class="px" style="padding:24px 32px 4px">
            ${label(plan.itemsTitle)}
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px">${items}
            </table>
          </td></tr>

          <tr><td class="px" style="padding:18px 32px 0"><div style="height:1px;line-height:1px;font-size:0;background:${t.divider}">&nbsp;</div></td></tr>

          <!-- próximos passos -->
          <tr><td class="px" style="padding:22px 32px 4px">
            ${label('Próximos passos')}
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:6px">${steps}
            </table>
          </td></tr>

          <!-- lista de espera -->
          <tr><td class="px" style="padding:14px 32px 4px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${t.waitBg}" style="background:${t.waitBg};border:1px solid ${t.waitBorder};border-radius:16px">
              <tr><td style="padding:18px 20px">
                <div style="${F}font-size:12px;line-height:16px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${t.waitLabel}">Sobre a lista de espera</div>
                ${plan.wait.map(p => `<div style="${F}font-size:15px;line-height:23px;color:${t.text};margin-top:10px">${rich(p)}</div>`).join('')}
              </td></tr>
            </table>
          </td></tr>

          <!-- botão -->
          <tr><td class="px" style="padding:22px 32px 32px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td align="center" bgcolor="${t.btnBg}" style="background:${t.btnBg};border-radius:14px">
                <a href="${esc(ctaUrl)}" target="_blank" style="display:block;padding:17px 20px;${F}font-size:17px;line-height:22px;font-weight:800;color:${t.btnFg};text-decoration:none;border-radius:14px">${esc(CTA.label)} &rarr;</a>
              </td></tr>
            </table>
            ${orderId ? `<div style="${F}font-size:12px;line-height:18px;color:${t.footer};text-align:center;margin-top:14px">Pedido ${esc(orderId)}</div>` : ''}
          </td></tr>
        </table>
      </td></tr>

      <!-- rodapé -->
      <tr><td align="center" class="px" style="padding:22px 24px 8px;${F}font-size:12px;line-height:19px;color:${t.footer}">
        <img src="${IMG}/logo.png" width="28" height="28" alt="Atende.AI" style="display:block;margin:0 auto 8px">
        ${esc(plan.footer)}<br>
        <a href="${SITE}" style="color:${t.link};text-decoration:none;font-weight:700">atendeaidelivery.com.br</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text = [
    plan.hello(firstName),
    '',
    plan.intro,
    '',
    plan.itemsTitle.toUpperCase(),
    ...plan.items.map(i => `- ${i}`),
    '',
    'PRÓXIMOS PASSOS',
    ...plan.steps.map((s, n) => `${n + 1}. ${s.title}: ${s.text}`),
    '',
    'SOBRE A LISTA DE ESPERA',
    ...plan.wait.map(p => p.replace(/<\/?b>/g, '')),
    '',
    `${CTA.label}: ${ctaUrl}`,
    orderId ? `\nPedido ${orderId}` : '',
    '',
    plan.footer,
    'atendeaidelivery.com.br',
  ].join('\n');

  return { subject: plan.subject, html, text };
}
