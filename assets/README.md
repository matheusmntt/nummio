# Nummio Brand & UI/UX Design Kit v2.0

Marca: **Nummio** · `nummio.dev`  
Assinatura: **Curiosity, engineered.**  
Posicionamento: **Independent technology lab**  
Escopo do site: o nummio.dev é construído como uma interface de alta performance (Modern UI/UX engineering). Isso descreve o padrão de execução do site, não o posicionamento da marca.

---

## O que há de novo na v2.0?

1. **Geometria Refinada de Logo & Monograma (`logo/` e `icons/`)**:
   - Correção do recorte óptico (negative-space cutout) no monograma `N`, eliminando a sobreposição entre a haste direita e o bloco Signal e garantindo nitidez absoluta de `16×16px` a `512×512px`.
   - Unificação geométrica do ponto final do wordmark (`nummio.`) com o bloco modular do símbolo.
   - Inclusão de **Lockups Horizontais Completos** (`nummio-lockup-dark`, `nummio-lockup-light`) e variantes para os novos temas de cor (`infrared`, `cyan`, `light-signal`).
2. **4 Direções de Arte de Nível Estúdio + Placas Raw (`imagery/`)**:
   - Substituição dos estudos básicos da v1 por renderizações de alta precisão física e óptica (mármore em chiaroscuro com malha laser 3D, variedade paramétrica Houdini/Octane, concreto brutalista + alumínio CNC + vidro fumê) e adição do **4º pilar inédito: `interface-systems.jpg` (Kinetic Interfaces — High-FPS UI/UX)**.
   - HUD tipográfico vetorial livre de artefatos de IA, com cápsulas de vidro escuro garantindo contraste AAA.
   - Pasta `imagery/raw/` contendo as 4 artes limpas (sem texto) em alta resolução para uso flexível em layouts e hero sections.
3. **Sistema de Tokens Multi-Tema (`system/tokens.css` & `system/tokens.json`)**:
   - **Theme 01 — Signal Core (Default)**: Os tokens originais preservados (`#0B0F14`, `#151B22`, `#F2F1ED`, `#B7FF63`, `#A38CFF`, `#A5A9B8`) expandidos com tokens semânticos de superfície, vidro, bordas especulares de `1px` e curvas de movimento 120Hz.
   - **Theme 02 — Cyber Infrared (Alternativa A)**: Paleta inspirada em hardware de precisão e telemetria (`#090B0E`, `#12161F`, `#F4F2ED`, `#FF5526`, `#FFB020`, `#949BA8`).
   - **Theme 03 — Quantum Cyan (Alternativa B)**: Paleta projetada para visualizações densas de dados, shaders e canvases (`#070B12`, `#0F1724`, `#EFF5FB`, `#00F0FF`, `#818CF8`, `#8B9BB4`).
   - **Theme 04 — Architectural Bone (Alternativa C — Light Mode)**: Tema claro editorial de alto contraste (`#F4F3EE`, `#EAE8E0`, `#0B0F14`, `#58B800`, `#6E56CF`, `#5C6270`).
4. **Engenharia de Prompts Documentada (`system/prompts.md`)**:
   - Matriz modular de prompts para geração consistente de ativos 3D/fotográficos e variações por tema.
5. **Interactive Brand & UI/UX Explorer (`showcase.html`)**:
   - Abra `showcase.html` no navegador para testar os 4 temas de cores em tempo real sobre componentes de UI de alta performance, comparar os logos e copiar tokens com 1 clique.

---

## Estrutura de Pastas (`assets/`)

- `logo/`: Wordmarks e Lockups horizontais em SVG e PNG Retina (`dark`, `light`, `light-signal`, `mono-white`, `mono-black`, `infrared`, `cyan`).
- `icons/`: Símbolos modulares em SVG/PNG, favicons (`favicon.ico`, `favicon.svg`) e ícones de aplicação (`16px` a `512px`).
- `imagery/`: 4 estudos visuais finalizados (`1600×1000`), panoramas comparativos (`three-directions-preview.jpg`, `four-directions-preview.jpg`) e subpasta `raw/` sem texto.
- `social/`: Open Graph (`1200×630`), GitHub Banner (`1500×500`) e prancha comparativa dos 4 temas de tokens (`color-tokens-themes-1600x900.png`).
- `system/`: `tokens.css`, `tokens.json`, `brand-guidelines.md`, `prompts.md` e `fonts-links.md`.
- `showcase.html`: Aplicação interativa de demonstração do Brand Kit & Design System v2.0.
- `studies/`: masters próprios do laboratório (fora do kit), com procedência em `studies/README.md`.

No site, `pnpm brand:sync` gera os ícones, o card social e os recortes web a partir desta pasta. Os tokens CSS que o site usa ficam em `src/styles/` (o `system/tokens.css` daqui é a referência multi-tema do kit).


---

## Expansão de Ativos Visuais (v2.1 — Galeria Estendida)

Sem remover nenhum arquivo anterior, o kit foi incrementado com **8 novos estudos visuais (`05` a `12`)**, **6 wallpapers WQHD (`2560×1440`)**, **panoramas comparativos** e **7 novos cartões sociais multi-tema**:

### Novos Estudos Visuais (`imagery/`)
- `optical-typography.jpg` (**Study 05**): Monograma `N` em prisma de vidro óptico fumê refratando cáusticas em `#B7FF63` e `#A38CFF`.
- `tactile-hardware.jpg` (**Study 06**): Dial rotativo em titânio CNC recartilhado a diamante com anel de safira e índice laser `#B7FF63`.
- `neural-topology.jpg` (**Study 07**): Topologia 3D de grafos distribuídos com poliedros de vidro fumê e caminho computacional luminoso.
- `cymatic-resonance.jpg` (**Study 08**): Ressonância cimática em ferrofluido e ondas harmônicas sob feixe laser horizontal.
- `theme-cyber-infrared.jpg` (**Study 09 — Theme 02 Alt A**): Planos isométricos de UI em titânio e vidro com telemetria em International Orange (`#FF5526`) e Laser Amber (`#FFB020`).
- `theme-quantum-cyan.jpg` (**Study 10 — Theme 03 Alt B**): Variedade de shaders WebGPU em ciano bioluminescente (`#00F0FF`) e vidro índigo (`#818CF8`).
- `theme-architectural-bone.jpg` (**Study 11 — Theme 04 Light Mode**): Monólito de travertino em luz natural com canaleta em grafite (`#0B0F14`) e refração laser Acid Moss (`#58B800`).
- `algorithmic-blueprint.jpg` (**Study 12**): Diagrama paramétrico CAD/Bézier em super-amostragem com anéis de calibração óptica.
- **Matrizes & Panoramas**:
  - `complete-12-studies-matrix.jpg` (`3200×1500` — Prancha completa com os 12 estudos).
  - `four-themes-artwork-preview.jpg` (`3200×500` — Comparativo artístico dos 4 temas de cor).
  - `imagery/themes/`: Subpasta dedicada com os 4 estudos visuais de cada tema de token.
  - `imagery/wallpapers/`: 6 Wallpapers Desktop/Hero em resolução **WQHD (`2560×1440`)**.

### Novas Variações Sociais (`social/`)
- `open-graph-v2-optical-prism-1200x630.png`
- `open-graph-v3-cyber-infrared-1200x630.png`
- `open-graph-v4-quantum-cyan-1200x630.png`
- `open-graph-v5-tactile-hardware-1200x630.png`
- `github-banner-v2-infrared-1500x500.png`
- `github-banner-v3-quantum-1500x500.png`
- `github-banner-v4-neural-graph-1500x500.png`
