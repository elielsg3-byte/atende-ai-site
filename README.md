# Atende.AI — site completo

Pacote da versão local de 24/10/2026, pronto para um repositório GitHub.

## Conteúdo

- `index.html`: página principal, com o Meta Pixel 1444232587293553 e as imagens atualizadas do Clube Founder PRO.
- `quiz-atende-ai.html`: diagnóstico interativo.
- `opcoes-demonstracao.html`: página existente de opções de demonstração.
- `assets/`: imagens e arquivos visuais locais utilizados pelas páginas.

O projeto é estático: HTML, CSS e JavaScript, sem instalação de dependências ou etapa de build.

## Enviar ao GitHub

1. Extraia o ZIP no computador.
2. Crie um repositório na sua conta do GitHub.
3. Use `Add file` → `Upload files`.
4. Envie o conteúdo da pasta extraída, incluindo a pasta `assets`. Não envie apenas o ZIP.
5. Confirme com `Commit changes`.

O arquivo `index.html` e a pasta `assets` devem ficar na raiz do repositório, lado a lado. Não envie a pasta externa inteira como uma subpasta.

## Importar na Vercel

1. Importe esse repositório como um novo projeto.
2. Selecione `Other` em Framework Preset.
3. Mantenha Root Directory na raiz do repositório.
4. Não configure comandos de instalação ou build.
5. Caso seja necessário informar Output Directory, use `.`.

Conecte o domínio em Settings → Domains e configure no Registro.br os registros DNS exibidos pela Vercel. Não altere registros de e-mail existentes sem verificar seu uso.

O suporte técnico a domínio próprio não muda a regra do plano: o Hobby da Vercel é restrito a uso pessoal e não comercial. A landing page comercial da Atende.AI requer um plano que permita esse uso.

## Verificações após publicar

- Abrir a página principal e confirmar o carregamento das imagens.
- Abrir e concluir o quiz.
- Conferir os links de checkout Basic e PRO.
- Confirmar o evento PageView do pixel no Gerenciador de Eventos da Meta.
- Revisar a política de privacidade e a configuração de consentimento antes de usar rastreamento com visitantes reais.

O pacote contém o código do pixel, mas não inclui API de Conversões nem confirmação de recebimento de eventos pela Meta. Fontes do Google, vídeo do YouTube e rastreamento dependem dos serviços externos correspondentes.

Não foram incluídos histórico Git, configurações internas de hospedagem, credenciais, backups ou arquivos temporários.
