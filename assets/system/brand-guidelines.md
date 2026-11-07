# Nummio — Brand & UI/UX Engineering Guidelines v2.0

## 1. Essência & Posicionamento
- **Nome**: **Nummio** (grafado em caixa-baixa `nummio.` no wordmark tipográfico).
- **Assinatura**: **Curiosity, engineered.**
- **Narrativa Operacional**: `Explorar → Compreender → Construir` (`Explore. Understand. Build.`).
- **Posicionamento**: **Independent technology lab**. Hub de tecnologia e inovação: produtos próprios (SaaS), desenvolvimento para empresas e pesquisa aplicada.
- **Método**: `Explore → Understand → Build`, que transforma `Curiosity → Questions → Models → Tools`.
- **Nota (v2.0)**: os princípios de UI/UX de alta performance (seção 4) são o padrão de execução do nummio.dev e das interfaces da Nummio, não o posicionamento da marca.

---

## 2. Sistema de Logos & Monograma (Refinamentos v2.0)

### O que mudou da v1.0 para a v2.0?
1. **Recorte Óptico no Monograma (`N`)**: Na v1.0, o bloco quadrado Signal sobrepunha a haste direita do `N` sem separação geométrica, gerando perda de nitidez em tamanhos reduzidos (`16px` e `32px`). Na v2.0, a haste vertical direita termina em `y=35` com um **gap arquitetônico de espaço negativo de `4.5px`** abaixo do módulo Signal (`rx="3.2"`), garantindo leitura cristalina até em favicons de `16×16px`.
2. **Unificação Geométrica do Ponto (`nummio.`)**: Na v1.0, o símbolo usava um quadrado arredondado enquanto o wordmark usava um círculo redondo. Na v2.0, o ponto final do wordmark adota a mesma geometria modular (`rect rx="4.5"`) do símbolo.
3. **Lockups Horizontais Completos**: Adicionados `nummio-lockup-dark.svg/png` e `nummio-lockup-light.svg/png` combinando o tile do monograma com o wordmark óptico.
4. **Variantes Temáticas**: Incluídas versões do símbolo e wordmark para os temas alternativos (`infrared`, `cyan` e `light-signal`).

### Regras de Uso
- **Área de Respiro**: No mínimo `1.5×` a largura do módulo Signal em todos os lados.
- **Escala Mínima**: Wordmark completo a partir de `120px` de largura; abaixo disso, utilizar exclusivamente o **Símbolo (`N`)**.
- **Proibições**: Nunca remover o ponto modular do wordmark, nunca aplicar sombras projetadas pesadas sobre o logo e nunca usar cores fora dos 4 temas oficiais de tokens.

---

## 3. Arquitetura de Tokens de Cor (Core + 3 Alternativas)

A v2.0 preserva integralmente a paleta original aprovada (**Theme 01: Signal Core**) e introduz **três alternativas completas de tokens semânticos** para diferentes contextos de produto e UI/UX:

| Token Semântico | Theme 01: **Signal Core** *(Default)* | Theme 02: **Cyber Infrared** *(Alt A)* | Theme 03: **Quantum Cyan** *(Alt B)* | Theme 04: **Architectural Bone** *(Light)* |
| :--- | :--- | :--- | :--- | :--- |
| `--nummio-graphite` / `--bg-canvas` | `#0B0F14` | `#090B0E` | `#070B12` | `#F4F3EE` |
| `--nummio-charcoal` / `--bg-surface-2` | `#151B22` | `#12161F` | `#0F1724` | `#EAE8E0` |
| `--nummio-bone` / `--text-primary` | `#F2F1ED` | `#F4F2ED` | `#EFF5FB` | `#0B0F14` |
| `--nummio-signal` / `--accent-primary` | `#B7FF63` | `#FF5526` | `#00F0FF` | `#58B800` |
| `--nummio-iris` / `--accent-secondary` | `#A38CFF` | `#FFB020` | `#818CF8` | `#6E56CF` |
| `--nummio-steel` / `--text-secondary` | `#A5A9B8` | `#949BA8` | `#8B9BB4` | `#5C6270` |

### Diretrizes de Aplicação em UI/UX
- **Proporção 80 / 15 / 5**: 80% superfícies neutras profundas (`Graphite`/`Charcoal`), 15% tipografia e bordas especulares (`Bone`/`Steel`), 5% acento intencional (`Signal`/`Iris`).
- **Bordas Hairline de 1px**: Em interfaces escuras, prefira bordas translúcidas (`rgba(242, 241, 237, 0.08)` a `0.14`) combinadas com highlight superior interno (`inset 0 1px 0 rgba(255, 255, 255, 0.06)`) em vez de sombras escuras pesadas.
- **Acessibilidade (WCAG 2.1)**:
  - `Bone (#F2F1ED)` sobre `Graphite (#0B0F14)` = **16.8:1 (AAA)**.
  - `Signal (#B7FF63)` sobre `Graphite (#0B0F14)` = **14.9:1 (AAA)**.
  - Botões preenchidos com `--accent-primary` devem sempre utilizar `--text-on-accent` (`#0B0F14` nos temas escuros).

---

## 4. Princípios de Alta Performance em UI/UX (120Hz Craft)

1. **Latência Percebida Zero (< 16ms / 8.3ms)**:
   - Feedback visual imediato em `hover`, `active` e atalhos de teclado (`⌘K`, `Esc`, `J/K`).
   - Micro-interações rápidas (`--duration-micro: 110ms`, `--duration-fast: 180ms`) usando curvas de desaceleração exponencial (`--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`).
2. **Telemetria Tipográfica (`tabular-nums`)**:
   - Todo contador, métrica de latência, FPS, coordenadas ou código deve usar `--nummio-font-mono` com `font-variant-numeric: tabular-nums` para evitar jitter horizontal durante atualizações em tempo real.
3. **Camadas Ópticas & Vidro Escuro**:
   - Command palettes, toasts e cabeçalhos flutuantes utilizam `--bg-glass` com `backdrop-filter: saturate(180%) blur(16px)` e borda de `1px` `--border-default`.

---

## 5. Direção Visual & Fotografia Conceitual (4 Pilares)

1. **Study 01 — Classical Intelligence**: Escultura clássica em chiaroscuro combinada com malha topográfica a laser (`#B7FF63`). Representa filosofia, contexto histórico e pensamento fundamental.
2. **Study 02 — Computational Forms**: Campos vetoriais 3D, partículas e variedades matemáticas em alta velocidade. Representa algoritmos, dados e emergência.
3. **Study 03 — Constructed Forms**: Concreto brutalista, alumínio anodizado preto usinado em CNC com chanfros de 45° e vidro óptico fumê. Representa arquitetura de sistemas e rigor construtivo.
4. **Study 04 — Kinetic Interfaces *(Novo na v2.0)***: Planos isométricos de UI em vidro escuro, grids milimétricos e splines Bézier luminosas. Representa o estado da arte em engenharia de interfaces modernas.
