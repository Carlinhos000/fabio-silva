# Imagens e fontes

## Hero atual — referência de piscina ao pôr do sol

Arquivo final: `public/images/hero-reference-sunset.jpg` (1672 × 941 px).

Reconstrução ilustrativa feita com a ferramenta integrada imagegen, em modo de edição a partir da captura fornecida pelo usuário. A cena mantém a residência à direita, o terraço, a piscina de borda infinita, o pôr do sol e a atmosfera quente da referência. Textos, marca, botões, cartões e legenda sobrepostos foram removidos da imagem. A origem PNG foi preservada; uma cópia JPEG otimizada foi incluída no projeto.

Não representa um imóvel disponível, uma fotografia factual de Sorocaba ou uma oferta comercial. A legenda da hero identifica a imagem como ilustrativa.

Prompt final utilizado:

> Use case: precise-object-edit. Asset type: clean photographic background for a real estate website hero, landscape 16:9, ideally 2048x1152. Image 1 is the edit target: an architectural scene covered by website UI and a large video-caption overlay. Extract and reconstruct ONLY the architectural photographic scene. Remove every logo, every letter and word, every navigation item, icon, button, informational panel, inset property thumbnail, and the large central caption 'Fiz essa prévia e...'. Reconstruct the obscured scene naturally. Preserve the reference scene and its camera composition as faithfully as possible: a contemporary luxury residence terrace occupying the right half, deep dark timber overhanging roof cutting diagonally from upper center to upper right, tall glass sliding doors, warmly glowing amber interior, cream loungers and a sofa on the right, an infinity swimming pool extending from lower center toward a dramatic warm orange sunset in the central horizon, distant coastal bay and mountain silhouettes toward center-left, palm trees and dark tropical foliage along the lower-left edge, cinematic charcoal shadows on the left with natural atmospheric negative space for HTML text. Keep the pool geometry, house location, perspective, sunset position, warm copper lighting, and rich natural textures. Produce a full-bleed photorealistic image, no borders, no UI, no text, no typography, no watermarks, no humans. Do not add graphic gradients or decorative elements. The result will be labeled an illustrative architectural scene, not an actual listing or a factual location in Sorocaba.

## Hero anterior — preservado

Arquivo final: `public/images/hero-architecture.webp`.

Criado com a ferramenta integrada de geração de imagens (skill imagegen), depois convertido para WebP. É uma ilustração arquitetônica, identificada no site, e não uma fotografia de um anúncio real em Sorocaba.

Prompt usado:

> Use case: photorealistic-natural. Asset type: original illustrative architectural hero photo for a Brazilian real estate website, wide cinematic 16:9 landscape, 2048x1152 if possible. Subject: an elegant contemporary two-story Brazilian residence, warm travertine and white concrete horizontal volumes, charcoal frames, enormous glass windows, wooden soffits, warmly lit interiors, inviting courtyard and minimalist tropical landscape. Camera: front three-quarter architectural editorial photo, camera at street level, entire building visible predominantly in central-right portion; left lower part offers shadowed greenery useful behind website copy; top quarter shows a serene dusky pale blue-grey sky useful behind huge typography. Lighting: blue hour immediately after sunset, soft interior amber lighting, balanced natural exposure, warm and tranquil but not excessively luxurious. Realistic photo texture, restrained landscaped grasses and a single leafy tree on far right. No swimming pool in foreground, no people, no cars, no logos, no words, no watermark, no graphic UI. This is explicitly an illustrative concept property, not a real listing or a factual image of Sorocaba. Render only one cohesive architectural photograph, not a collage or mockup.

O hero utiliza proporção ampla, imagem dominante à direita e área escura inferior para texto. Em celular, o texto passa para uma superfície sólida.

## Fotografias ilustrativas

Fotografias do Unsplash com licença para utilização comercial e não comercial: https://unsplash.com/license (verificada em 06/10/2026).

| Arquivo | Origem | Uso |
| --- | --- | --- |
| `house-contemporary.webp` | https://images.unsplash.com/photo-1600585154340-be6161a56a0c | Catálogo e galeria |
| `house-garden.webp` | https://images.unsplash.com/photo-1564013799919-ab600027ffc6 | Catálogo e proprietários |
| `interior-living.webp` | https://images.unsplash.com/photo-1600210492486-724fe5c67fb0 | Catálogo e ambiente ilustrativo no bloco sobre |
| `interior-kitchen.webp` | https://images.unsplash.com/photo-1600607687920-4e2a09cf159d | Galeria e imóvel em evidência |

Todas estão salvas localmente em WebP. Não há declaração de que sejam imóveis de Sorocaba ou anúncios do corretor.

## Fontes

Instrument Serif e Manrope, distribuídas pelo Fontsource sob SIL Open Font License. Fontes latinas locais incluem os caracteres portugueses utilizados.

- https://fontsource.org/fonts/instrument-serif
- https://fontsource.org/fonts/manrope
- https://openfontlicense.org/

Arquivos: `public/fonts/instrument-serif-latin.woff2` e `public/fonts/manrope-latin.woff2`.

## Marca Fábio Silva

Monograma FS redesenhado em SVG, com letra F arquitetônica e S de curva mais legível. O nome utiliza Manrope em caixa alta, com espaçamento próprio e assinatura “Casas em Sorocaba”. A marca é usada no cabeçalho, no rodapé e no perfil do corretor; o favicon também foi atualizado.

Arquivo vetorial do símbolo: `public/images/brand-fs.svg`. A versão composta com o nome está no componente `Brand`, em `src/components.tsx`, e seus estilos estão em `src/styles.css`.

Os vetores da marca são originais do projeto. A marca e os textos do site de referência não foram copiados.
