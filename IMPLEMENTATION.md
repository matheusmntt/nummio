# Implementação — Nummio.dev

Você é um engenheiro frontend sênior e diretor de arte digital especializado em interfaces de tecnologia, laboratórios de pesquisa e experiências web autorais.

Sua missão é **projetar e implementar o site institucional nummio.dev**, utilizando a identidade visual e os assets fornecidos neste repositório.

## 1. Contexto da marca

**Nummio** é um laboratório independente de tecnologia, software e pesquisa aplicada.

A marca explora a interseção entre curiosidade, pensamento crítico, engenharia e criação de ferramentas digitais.

- **Tagline:** Curiosity, engineered.
- **Filosofia:** Explore → Understand → Build.
- **Direção visual:** Experimental Tech × Modern Research.
- **Personalidade:** Experimental, intelectual, independente, técnica e criativa.
- **Objetivo:** Apresentar a Nummio, sua filosofia e seus projetos, criando uma base escalável para novos produtos.

Não apresente a Nummio como uma grande empresa. Evite inventar clientes, números, depoimentos ou conquistas.

## 2. Inspeção obrigatória do repositório

Antes de implementar:

1. Inspecione a estrutura do projeto, stack, dependências e convenções existentes.
2. Localize a pasta de assets da Nummio, que já estará disponível no repositório.
3. Leia `README.md`, `system/brand-guidelines.md`, `system/IMPLEMENTATION.md` e os arquivos de tokens.
4. Analise todos os logotipos, símbolos, favicons e imagens.
5. Preserve e reutilize os assets originais.

**Não recrie o logotipo nem gere imagens substitutas quando já existirem arquivos adequados.**

## 3. Stack e arquitetura

Caso o repositório ainda não tenha stack definida, utilize:

- Next.js com App Router.
- React e TypeScript.
- Tailwind CSS v4.
- pnpm.
- Server Components sempre que possível.

Use os tokens do branding como fonte única da verdade.

Implemente os temas dark e light, com dark como padrão, alternância funcional, preferência persistida e prevenção de flashes de tema.

Evite dependências desnecessárias.

## 4. Direção de arte

O resultado deve combinar a precisão de uma developer tool com a sofisticação editorial de um laboratório de pesquisa.

### Identidade

- Graphite: `#0B0F14`
- Charcoal: `#151B22`
- Bone: `#F2F1ED`
- Signal: `#B7FF63`
- Iris: `#A38CFF`

Utilize Space Grotesk para títulos e interfaces, e Geist Mono para informações técnicas e metadados.

### Linguagem visual

- Muito espaço negativo.
- Tipografia expressiva e hierarquia clara.
- Grids técnicos discretos.
- Linhas finas, coordenadas e identificadores.
- Composições assimétricas intencionais.
- Contraste entre imagens artísticas e componentes precisos.
- Microinterações cuidadosas.

**Não produza um template SaaS genérico.**

Evite gradientes neon, glassmorphism excessivo, ícones decorativos repetitivos, cards idênticos em todas as seções e animações de rolagem desnecessárias.

## 5. Direções de imagens

O repositório contém três famílias visuais que devem orientar o projeto.

### Classical Intelligence

Imagens de inspiração clássica, escultura, pensamento e filosofia.

Utilize essa linguagem nas seções de manifesto, pensamento e abordagem intelectual.

### Computational Forms

Partículas, geometria matemática, sistemas emergentes e visualizações computacionais.

Utilize no hero, em detalhes gráficos e nas seções relacionadas a software e tecnologia.

### Constructed Forms

Arquitetura brutalista, estruturas geométricas, matéria e construção.

Utilize nas seções relacionadas a engenharia, produtos e execução.

As três famílias devem formar uma narrativa visual coerente. Não são apenas imagens decorativas.

Use os arquivos reais disponíveis. Não atribua imagens conceituais a obras históricas reais.

## 6. Estrutura da homepage

### Header

Logotipo oficial, navegação para Projects, Approach, Research e About, alternador de tema e menu responsivo.

### Hero

Headline:

**Curiosity, engineered.**

Descrição curta sobre exploração, pesquisa e construção de software.

CTAs:

- Explore projects
- Our approach

Crie uma composição visual memorável utilizando os assets e o sistema gráfico da Nummio.

### Manifesto

Três princípios:

**Explore. Understand. Build.**

Apresente a filosofia do laboratório com linguagem objetiva, humana e intelectual.

### Selected Work

Apresente inicialmente:

**Nexus** — ferramenta de exploração, organização e investigação do conhecimento.

**Ion Framework** — experimento de framework reativo para interfaces web.

A arquitetura deve permitir novos projetos por meio de dados tipados, sem exigir alterações estruturais nos componentes.

Não invente links de produção. Utilize somente URLs verificadas no repositório.

### Research & Experiments

Uma seção editorial que apresenta a exploração intelectual e técnica da Nummio.

Use as três direções artísticas como forma de mostrar as diferentes dimensões do laboratório.

Não invente artigos ou publicações.

### About

Explique o que é a Nummio e por que ela existe.

A narrativa deve enfatizar curiosidade, pesquisa independente e engenharia.

### Footer

Wordmark, navegação, informações institucionais e links existentes. Adicione a assinatura _Curiosity, engineered._

## 7. Sistema de componentes

Crie uma arquitetura consistente, com componentes reutilizáveis:

- SiteHeader
- SiteFooter
- BrandMark
- ThemeToggle
- Hero
- SectionHeading
- ProjectCard
- ResearchTile
- EditorialLabel

Utilize componentes adicionais somente quando forem necessários.

Não replique estilos manualmente em várias seções. Use tokens semânticos e abstrações proporcionais à complexidade.

## 8. Responsividade, acessibilidade e performance

A experiência deve funcionar muito bem em mobile e desktop.

Obrigatório:

- Layout responsivo, inclusive em 375 px.
- Navegação por teclado.
- Estados de foco visíveis.
- Hierarquia correta de headings.
- Contrastes adequados.
- Suporte a `prefers-reduced-motion`.
- Imagens otimizadas.
- Metadados de SEO.
- Open Graph e favicons do kit.
- Ausência de erros de hidratação e links quebrados.

Não implemente backend, banco de dados, login ou funcionalidades desnecessárias.

## 9. Qualidade de execução

Antes de finalizar:

1. Execute lint.
2. Execute typecheck.
3. Execute build.
4. Corrija os erros encontrados.
5. Revise o resultado visual em diferentes tamanhos de tela, caso exista ambiente de preview.
6. Verifique o uso correto dos assets e tokens.

Não declare testes como concluídos se não puder executá-los.

## 10. Critérios de aprovação

A implementação deve parecer uma marca própria, não um tema adquirido.

O resultado precisa transmitir simultaneamente:

- A precisão de uma empresa de developer tools.
- A profundidade de um laboratório de pesquisa.
- A ousadia de um ambiente de experimentação.
- A clareza de um produto digital contemporâneo.

**Priorize qualidade visual, coerência de identidade, acessibilidade e engenharia.**

Entregue uma implementação funcional, não apenas mockups ou uma proposta de layout.

Ao concluir, apresente os arquivos criados, as decisões de arquitetura, os testes executados e eventuais pendências.
