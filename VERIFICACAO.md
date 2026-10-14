# Verificação da entrega

Revisão realizada em 06/10/2026 na prévia local.

## Animações e profundidade — revisão final

- Os dois componentes fornecidos foram adaptados em `src/components/ui`: timeline das quatro etapas reais do atendimento e destaques horizontais com dados demonstrativos já existentes.
- GSAP, SplitText, ScrollTrigger, Tailwind v4 e a estrutura compatível com shadcn foram integrados sem substituir o tema existente. `shadcn info --json` reconheceu a configuração.
- Desktop em 1440 × 1000: dois pins ativos, deslocamento horizontal da timeline e troca de destaque pelo controle verificados. Títulos e descrições permanecem legíveis.
- Celular em 390 × 844: nenhum pin ativo, fluxo vertical, quatro etapas completas no documento e ausência de rolagem horizontal. A limpeza da divisão de texto e dos pins foi verificada ao mudar do desktop para celular.
- Profundidade 3D: movimento do ponteiro ativou a perspectiva da foto, com rotação de 1,97° observada. O favorito continuou funcionando e foi restaurado ao estado anterior após o teste.
- A página individual do imóvel, o menu móvel e a navegação para as seções permaneceram funcionais. Links diretos com fragmento aguardam o layout inicial antes de posicionar a seção.
- Entradas decorativas, diálogo e troca de depoimento têm movimentos curtos. Teclado não depende de hover; foco dentro de um bloco de entrada torna seu conteúdo imediatamente visível.
- Os hooks usam media queries de movimento reduzido com limpeza automática. Essa preferência não foi emulada no sistema durante esta revisão; a versão sem pins foi exercitada por largura móvel, e as regras de redução foram verificadas no código.
- Compilação de produção e TypeScript concluídos. JavaScript compactado; GSAP está em módulo separado. Console sem erros ou avisos capturados nos fluxos finais.
- Capturas: `preview-animation-timeline.jpg`, `preview-animation-feature.jpg`, `preview-animation-mobile.jpg` e `preview-final.jpg`.

## Ajuste da hero em 06/10/2026

- O fundo foi substituído por uma reconstrução ilustrativa da cena da referência: piscina de borda infinita, residência à direita e pôr do sol. A imagem anterior foi preservada como arquivo alternativo.
- Os textos, botões, avaliações e links originais da hero foram restaurados. A palavra em grande escala “SOROCABA” foi retirada a pedido. O restante das seções mantém a composição e o conteúdo anteriores.
- O cabeçalho é transparente no início da página e ganha fundo ao rolar ou abrir o menu móvel. As páginas internas mantêm o cabeçalho regular.
- A marca foi refinada com um novo monograma vetorial FS e um nome com tipografia e espaçamento próprios. O rodapé, o perfil e o favicon usam a mesma identidade.
- O botão flutuante de WhatsApp mantém o comportamento original.
- Nova compilação e verificação de TypeScript concluídas; transparência, navegação até o catálogo e fechamento do menu por Escape verificados na prévia.
- Novas capturas: `preview-hero-desktop.jpg` e `preview-hero-mobile.jpg`.

## Correção da ativação dos dois efeitos na prévia

- Causa confirmada: a janela de 870 × 668 px não correspondia à antiga condição mínima de 1060 × 700 px.
- Timeline e destaques horizontais agora ativam a partir de 800 × 640 px, respeitando movimento reduzido.
- Em 870 × 668 px: duas cenas ativas; deslocamento da timeline observado de 0 para -118,747 px; botão Casa com jardim moveu os destaques até -842 px, com conteúdo e ações legíveis.
- Em 390 × 844 px: duas cenas de revelação em fluxo normal, nenhum pin ou rolagem horizontal involuntária; a fotografia da timeline variou de escala 1,07 para 1,0138 durante a rolagem.
- Entrada direta em `/#processo` no celular posicionou a seção abaixo do cabeçalho, em 105,25 px.
- Capturas adicionais: `preview-animation-fixed.jpg` e `preview-feature-fixed.jpg`.

## Verificações da implementação inicial

- Compilação de produção e TypeScript: concluídos sem erros.
- Desktop: composição do hero e seção sobre revisadas em 1440 px.
- Mobile: hero, catálogo, menu e página individual revisados em 390 px.
- Reflow: larguras de 320, 390, 820 e 1440 px verificadas sem rolagem horizontal involuntária.
- Busca: seleção de Sobrado e Apartamento retornou o exemplo correspondente.
- Preço: faixa selecionada retornou estado vazio responsável, sem preços fictícios.
- Favoritos: inclusão e persistência após recarregar verificadas; página de favoritos e remoção também verificadas. O favorito criado no teste foi removido.
- Formulário do proprietário: telefone inválido apresentou erro; dados válidos prepararam a mensagem com os campos corretos. Nenhuma mensagem foi enviada.
- Galeria: abertura, mudança de imagem e fechamento por Escape verificados.
- Menu: abertura e fechamento por Escape verificados.
- FAQ: expansão da resposta verificada.
- Depoimentos: navegação manual alterou o depoimento e o autor.
- Compartilhamento: acionamento do fluxo nativo sem erro no console. Não foi enviado um anúncio a um destinatário externo durante o teste.
- Carregamento: fontes locais carregadas e ausência de imagens quebradas na página inicial.
- Console da prévia: sem erros ou avisos capturados durante os fluxos exercitados.
- Contraste: cinco pares opacos essenciais verificados pelo utilitário da skill, todos acima de 4,5:1. Isso não constitui auditoria completa de acessibilidade, nem mede texto sobre fotografias.

Limites: catálogo demonstrativo, sem integração de API imobiliária ou backend de leads; Instagram, CRECI e retrato oficial aguardam preenchimento. O mapa foi preparado para carregar sob demanda; a localização pública está no link de rota. Não foi realizado teste com leitor de tela, nem medição de desempenho em produção. Os formulários encaminham a conversa pelo WhatsApp e não persistem os dados no site.
