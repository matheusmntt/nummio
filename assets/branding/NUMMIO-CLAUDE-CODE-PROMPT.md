# Claude Code — Implementar nummio.dev

Você é um engenheiro frontend sênior e diretor de arte digital especializado em landing pages de produtos de tecnologia. Implemente o site institucional **nummio.dev** neste repositório.

## Contexto
Nummio é um laboratório independente de tecnologia, software e pesquisa aplicada. Atua como marca guarda-chuva para projetos independentes, experimentos e publicações, com estética **Experimental Tech × Modern Research**. Tagline: **Curiosity, engineered.** Narrativa: Explore → Understand → Build. A marca não deve fingir ser uma empresa grande nem inventar clientes, prêmios, números, equipe ou depoimentos.

## OBRIGATÓRIO: primeiro inspecione o projeto e os assets
1. Explore a estrutura real do repositório, package manager, configurações e convenções. **Não recrie o projeto se já existe.**
2. Localize a pasta de assets/branding que já estará neste repositório. Faça uma listagem, leia `README.md`, `system/brand-guidelines.md`, `system/IMPLEMENTATION.md` e os tokens. O caminho da pasta é variável: descubra-o; não assuma `public/brand`.
3. Use os SVG, PNG, ICO e imagens já fornecidos. Não substitua o logotipo por texto estilizado se houver wordmark vetorial válido. Não regenere imagens nem logo. Preserve os arquivos originais, otimize cópias de produção se necessário.
4. Se algo faltar, utilize fallback elegante e registre a lacuna; não crie links quebrados nem dados fictícios.

## Stack preferida
- Se o repositório já tiver stack definida, respeite-a. Se estiver vazio: Next.js App Router + TypeScript + Tailwind CSS v4 + pnpm.
- Use componentes React e Server Components por padrão. Evite dependências desnecessárias, animação pesada e bibliotecas de UI que apaguem a identidade.
- Integre `system/tokens.css` como fonte da verdade; se usar Tailwind v4, use `system/tailwind-v4.css` e `@theme inline`, mantendo tokens semânticos.
- Preferir Space Grotesk (display/UI) + Geist Mono (metadados). Carregue fontes legalmente por pacote/fonte oficial; não invente caminhos/fontes.

## Identidade visual obrigatória
- Wordmark `nummio.` minúsculo, monograma N geométrico e paleta: Graphite `#0B0F14`, Charcoal `#151B22`, Bone `#F2F1ED`, Signal `#B7FF63`, Iris `#A38CFF`.
- Dark mode inicial; light mode consistente, com toggle funcional e preferências persistidas. Use os semantic tokens `--nm-*`, inclusive accent escuro em light mode.
- Visual editorial, layouts assimétricos pontuais, muito espaço negativo, grids finos e metadados discretos. Equilíbrio: tecnologia precisa + pesquisa contemplativa.
- Use as **três famílias de imagens existentes** com propósito explícito: `classical-intelligence.jpg` para pensamento/filosofia, `computational-forms.jpg` para software/sistemas, `constructed-forms.jpg` para engenharia/construção. Essas imagens são estudos criativos: não as atribua a museus/edifícios históricos reais.
- Sem emojis na UI, glassmorphism gratuito, gradientes neon genéricos, carrosséis automáticos ou animações que comprometam performance.
- Layout responsivo, visual caprichado em 375px, tablet e desktop widescreen.

## Estrutura e conteúdo mínimo
1. Header fixo ou sticky: logo real; links Projects, Approach, Research, About; seletor de tema; menu mobile acessível.
2. Hero: label `INDEPENDENT TECHNOLOGY LAB`, headline `Curiosity, engineered.`, apoio conciso sobre explorar ideias e criar ferramentas úteis; CTAs `Explore projects` e `Our approach`; ilustração construída a partir das imagens e gráficos do kit, com ótimo contraste e sem excesso visual.
3. Manifesto/Approach: **Explore / Understand / Build** com textos curtos e diretos, sem linguagem corporativa vazia.
4. Selected Work: cards para **Nexus** (exploração do conhecimento) e **Ion Framework** (experimento em reatividade/web). Descreva com parcimônia; **não invente URLs de produção**. Centralize links configuráveis; se URLs não estiverem no projeto, cards não devem fingir navegar para páginas prontas. Deixe estrutura fácil para acrescentar produtos.
5. Research / Visual Thinking: sessão editorial que usa Classical Intelligence, Computational Forms e Constructed Forms como três linguagens de investigação; pode apresentar essas linhas editoriais sem fingir que são artigos publicados.
6. About: identidade do laboratório independente, curiosidade + engenharia + descoberta; tom humano e preciso.
7. Footer: wordmark, navegação, `nummio.dev`, copyright dinâmico e links sociais somente se conhecidos no repositório.

## Arquitetura e componentes
- Componentes sugeridos: SiteHeader, SiteFooter, BrandMark, ThemeToggle, Hero, SectionHeading, ProjectCard, ResearchTile, EditorialLabel.
- Estruture conteúdo dos projetos como dados tipados separados da UI; evite hardcode disperso.
- Crie metadata de SEO (title, description, canonical de `https://nummio.dev`, Open Graph usando asset existente). Favicons e apple touch icon do kit.
- Acessibilidade: heading hierarchy; navegação por teclado; focus visible; alt text contextual; contrastes adequados; `prefers-reduced-motion`; controles com área clicável confortável.
- Qualidade: não haver erros de console, warnings de hydration, broken images ou layout shift significativo. Priorize imagens responsivas e `next/image` quando pertinente.
- Não implemente backend, login, banco de dados, analytics ou newsletter sem necessidade.

## Execução e entrega
1. Inspecione assets, estrutura, scripts e dependências atuais.
2. Faça um plano curto e implemente os componentes de forma incremental.
3. Execute lint, typecheck e build (ou scripts equivalentes) e corrija os erros. Se algum comando não puder executar, relate exatamente qual e por quê.
4. Revise a responsividade e interação se existir ambiente/browser de preview; caso contrário, descreva testes manuais pendentes sem fingir que rodou.
5. Entregue resumo das alterações, árvore dos arquivos principais, decisões de design, comandos de execução e pontos pendentes.

## Critérios de aprovação
- O site parece uma marca original e coerente de research/devtools, **não** um template genérico.
- Utiliza de verdade os assets existentes e as 3 direções de imagens.
- Tokens semânticos conduzem toda a interface (dark/light), sem hex avulsos nos componentes.
- A identidade `nummio.` é consistente em desktop/mobile, favicon e social preview.
- Seções e conteúdo são honestos, objetivos e facilmente expansíveis para subdomínios/projetos futuros.
- Build e verificações disponíveis passam.
