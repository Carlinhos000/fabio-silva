# Fábio Silva — Casas em Sorocaba

Site em React e TypeScript com direção visual baseada na referência arquitetônica enviada. A skill **CodeMakers-Design** orientou composição, estados funcionais e revisão visual. O catálogo é demonstrativo, sem preços inventados ou ofertas comerciais.

## Executar

Requisitos: Node.js 22 ou superior e pnpm.

```powershell
pnpm install
pnpm build
pnpm preview
```

Abra http://127.0.0.1:5173. A prévia serve o resultado compilado, incluindo as páginas individuais.

Para editar com atualização automática em um terminal normal:

```powershell
pnpm dev
```

A compilação faz a verificação de tipos e o empacotamento em um único processo. No ambiente restrito deste chat, também pode ser executada diretamente:

```powershell
node scripts/build.mjs
node scripts/serve.mjs
```

## Conteúdo que precisa ser confirmado

Edite `src/data.ts`:

- `business.instagram`: endereço completo do perfil oficial. O link aparece automaticamente no contato e no rodapé quando preenchido.
- `business.creci`: número oficial do registro. Nunca foi criado um número fictício.
- `business.portrait`: fotografia autorizada do corretor. Sem ela, o bloco utiliza um ambiente residencial identificado como ilustrativo.
- `business.siteUrl`: endereço público confirmado para os links canônicos.
- Endereço e horário: foram utilizados os dados fornecidos, sem presumir dias de atendimento.
- Nota e quantidade de avaliações: dados fornecidos, sem sincronização automática com o Google.
- `properties`: substitua cada exemplo por um anúncio autorizado, incluindo título, características, bairro, imagens, disponibilidade e preço confirmado.

`price: null` significa **Valor sob consulta**. As faixas de preço só retornam imóveis com valor numérico preenchido. Nos exemplos atuais, selecionar uma faixa apresenta o estado vazio explicando que não há preços cadastrados.

Mantenha `demo: true` nos exemplos. Depois de substituir todas as informações de um anúncio, use `demo: false`. Adapte também os avisos globais de catálogo demonstrativo em `App.tsx` e `components.tsx` ao substituir o catálogo inteiro.

## Funcionalidades

- Catálogo com filtros por objetivo, tipo, bairro, preço, quartos e vagas;
- Páginas em `/imoveis/<slug>`;
- Galeria com ampliação, miniaturas, controles de navegação e fechamento por Escape;
- Favoritos locais em `/favoritos`, preservados entre visitas neste navegador;
- Compartilhamento nativo ou cópia do endereço;
- Formulário de proprietário e formulário de interesse;
- Validação do telefone e preparação de mensagem para WhatsApp;
- Depoimentos reais resumidos com navegação manual;
- Perguntas frequentes em disclosures nativos acessíveis;
- Menu móvel, botão de WhatsApp e CTA de visita para celular;
- Mapa carregado sob demanda e rota para o endereço informado;
- Página `/privacidade`;
- Fontes e fotografias locais, favicon próprio e metadados básicos.
- Timeline animada das quatro etapas do atendimento;
- Destaques de imóveis com transição horizontal e revelação de texto no desktop;
- Profundidade 3D discreta nas fotografias para mouse, entrada cinematográfica da foto da hero e feedback nos botões;
- Revelação das etapas e imagens durante a rolagem no celular; layout estático completo para preferência por movimento reduzido.

Os formulários não armazenam nem enviam dados a um backend. Eles preparam uma mensagem, e o visitante clica para revisar e enviá-la no WhatsApp. Fotos do proprietário são enviadas na conversa. O mapa e os destinos dos links são reais; mensagens não foram enviadas durante a verificação.

## Arquivos principais

- `src/App.tsx`: páginas, busca e seções;
- `src/components.tsx`: cabeçalho, cards, favoritos, formulários e rodapé;
- `src/data.ts`: cadastro central de dados e imóveis;
- `src/styles.css`: tokens e estilos responsivos;
- `src/components/ui/timeline.tsx`: componente adaptado da timeline fornecida;
- `src/components/ui/horizontal-feature-reveal.tsx`: componente adaptado dos destaques fornecidos;
- `src/hooks/use-scroll-scene.ts`: carregamento separado de GSAP, media queries e limpeza das cenas;
- `src/hooks/use-site-motion.ts`: profundidade com ponteiro, entradas progressivas e limpeza dos efeitos;
- `src/tailwind.css`: utilitários Tailwind v4 sem sobrescrever o reset existente;
- `components.json`: configuração e aliases compatíveis com shadcn;
- `public/images/`: fotos ilustrativas e hero original;
- `public/fonts/`: fontes locais;
- `scripts/build.mjs`: validação TypeScript e compilação;
- `scripts/serve.mjs`: prévia local com fallback de rotas;
- `dist/`: resultado compilado para hospedagem estática.

Uma hospedagem estática deve redirecionar rotas inexistentes para `/index.html`. O arquivo `_redirects` atende a plataformas compatíveis; outros provedores precisam da regra equivalente. Antes de publicar, substitua o catálogo ilustrativo e confirme os dados oficiais. Metadados das páginas de imóvel são atualizados no navegador; geração estática ou renderização no servidor será necessária para previews específicos reconhecidos por todos os robôs de compartilhamento.

## Imagens e licenças

Veja `ASSETS.md` para origem das imagens, fontes e prompt do hero. As imagens ilustrativas não comprovam a localização ou disponibilidade de um imóvel e devem ser substituídas por fotografias autorizadas dos anúncios oficiais.

## Integração dos dois componentes de animação

React e TypeScript já existiam. Foram adicionados GSAP, Tailwind CSS v4, os utilitários `clsx`/`tailwind-merge` e a configuração compatível com shadcn. O comando `shadcn info --json` reconheceu Vite, TypeScript, Tailwind v4 e os aliases configurados.

O diretório padrão é `src/components/ui`, importado como `@/components/ui`. O prefixo `src` acompanha a organização existente do projeto. Esse diretório separa componentes reutilizáveis das seções e páginas, permite os imports dos exemplos e mantém compatibilidade com futuras instalações pelo shadcn. Estilos do tema continuam em `src/styles.css`; utilitários ficam em `src/tailwind.css`.

Não é necessário reinicializar o projeto nem aplicar um preset visual. Para consultar a configuração em um ambiente normal:

```powershell
pnpm dlx shadcn@latest info --json
```

Os demos de produto, datas fictícias, fundos brancos, imagens incorporadas em base64 e textos de valorização dos exemplos não foram incluídos. A timeline utiliza `buyingJourney`, e os destaques utilizam `highlightedFeatures`, ambos em `src/data.ts`. A hero e o conteúdo de contato permanecem preservados.

O desktop usa deslocamento proporcional ao conteúdo, sem interceptar o scroll nativo. A partir de 800 px de largura e 640 px de altura, os dois efeitos horizontais ficam ativos, inclusive na janela compacta da prévia. Em telas menores ou mais baixas, as etapas, textos e fotografias têm revelação na rolagem, sem fixar a tela. Com movimento reduzido, todos os elementos permanecem estáticos e visíveis. `prefers-reduced-motion` também desativa perspectiva com mouse e as entradas decorativas. Não há modelos 3D de imóveis: a profundidade utiliza perspectiva CSS sobre fotografias ilustrativas.

A implementação segue a documentação oficial de [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [SplitText](https://gsap.com/docs/v3/Plugins/SplitText/) e [matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/). Seletores são locais às cenas, títulos divididos preservam seus rótulos acessíveis, e animações, listeners, splits e pins são revertidos ao mudar de layout ou desmontar.

GSAP é um módulo separado, carregado somente quando a preferência de movimento permite os efeitos. A compilação portátil também gera Tailwind e compacta os módulos em um único processo com Terser. A configuração Vite suporta o fluxo habitual `pnpm dev`.
