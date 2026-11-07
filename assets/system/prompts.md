# Nummio v2.0 — AI Art Direction & Prompt Engineering System

Este guia documenta a evolução da direção de arte da **Nummio v2.0**, explicando os problemas técnicos corrigidos em relação à v1.0 e fornecendo a arquitetura modular de prompts para geração de imagens conceituais, estudos de UI/UX de alta performance e materiais de lançamento.

---

## 1. Diagnóstico Técnico: Por que os Prompts da v1.0 Falharam?

Na versão 1.0, as três imagens da pasta `imagery/` apresentavam falhas críticas que comprometiam a percepção de maturidade do laboratório:
1. **Alucinação Tipográfica (Gibberish de IA)**: Em `classical-intelligence.jpg` (v1), o prompt tentou gerar metadados dentro do próprio modelo de difusão, resultando em caracteres corrompidos (`LA8 / R&0 / BUILD`).
2. **Falta de Materialidade e Iluminação Física (PBR)**: `computational-forms.jpg` (v1) e `constructed-forms.jpg` (v1) pareciam gráficos vetoriais básicos 2D sem raytracing, profundidade de campo (DoF), refração óptica ou textura de superfície.
3. **Ausência do Pilar Principal (UI/UX de Alta Performance)**: O kit original não possuía uma direção visual dedicada a interfaces modernas de 120Hz, camadas de vidro fosco escuro (`backdrop-filter`), bordas especulares de `1px` e curvas Bézier de precisão.

---

## 2. Regra de Ouro da Pipeline Visual Nummio v2.0

> **NUNCA peça para o modelo de imagem renderizar textos ou HUDs tipográficos.**
> Gere a **Placa Base (Raw Master Plate)** 100% livre de texto (`no text, no typography, no watermarks`) focada em geometria, luz e materiais físicos. Em seguida, aplique a camada de telemetria (`Geist Mono` / `JetBrains Mono`) e títulos editoriais (`Space Grotesk` / `Inter Display`) via composição vetorial/programática.

---

## 3. Fórmula Modular de Prompt (Nummio Prompt Matrix)

Todo prompt da Nummio deve seguir os **5 blocos estruturais**:

```text
[1. SUBJECT & GEOMETRY] + [2. MATERIALITY & TOKENS] + [3. OPTICAL & LIGHTING RIG] + [4. UI/UX PRECISION CUES] + [5. NEGATIVE CONSTRAINTS]
```

- **Bloco 1 (Sujeito e Geometria)**: Escultura clássica em chiaroscuro, variedade paramétrica (Houdini/Octane), monólito brutalista usinado em CNC ou planos isométricos de interface em vidro escuro.
- **Bloco 2 (Materialidade e Tokens de Cor)**: Fundo em obsidiana profunda (`#0B0F14`) e carvão (`#151B22`), superfícies em mármore/concreto/titânio (`#F2F1ED`, `#A5A9B8`), feixe de laser calibrado em verde sinal (`#B7FF63`) e refração cáustica sutil em violeta íris (`#A38CFF`).
- **Bloco 3 (Óptica e Iluminação)**: Lente macro tilt-shift 85mm f/2.8, iluminação de borda direcional (rim lighting), raytraced caustics, micro-textura física.
- **Bloco 4 (Referências de Craft UI/UX)**: Estética industrial inspirada em *Linear, Vercel, Raycast, Teenage Engineering, Dieter Rams, Tadao Ando*.
- **Bloco 5 (Restrições Negativas)**: `No text, no letters, no numbers, no watermarks, no neon cyberpunk clichés, no sci-fi robots, no stock photo clutter.`

---

## 4. Prompts Oficiais de Produção (v2.0)

### Direção 01 — Classical Intelligence (`classical-intelligence.jpg`)
**Conceito**: O pensamento clássico e a epistemologia humana mapeados por visão computacional de altíssima precisão.

```text
Close-up macro studio photography of a classical Greco-Roman sculpted dark-toned Carrara marble bust emerging from deep matte obsidian darkness (#0B0F14). Dramatic directional chiaroscuro rim lighting in warm bone white (#F2F1ED). Across one side of the sculpted marble face, an ultra-fine, razor-sharp geometric laser topography contour mesh and a single delicate orbital arc in electric signal lime (#B7FF63) subtly trace the spatial geometry of the sculpture. Pure editorial art direction combining classical human intellect with high-precision spatial computing. Shot on Hasselblad H6D-100c, 85mm macro lens, shallow depth of field, crisp micro-texture of stone grain and optical laser light. No text, no letters, no watermarks. --ar 16:10 --stylize 250 --v 6.1
```

### Direção 02 — Computational Forms (`computational-forms.jpg`)
**Conceito**: Estruturas de dados emergentes, campos vetoriais e pipelines de shaders GPU a 120fps.

```text
Macro 3D Houdini and Octane render of a high-precision mathematical vector field and algorithmic wave topology suspended in a deep obsidian void (#0B0F14). Composed of thousands of razor-sharp, luminous micro-rods and precision instanced nodes arranged in a flowing parametric manifold. Most nodes are warm bone white (#F2F1ED) and brushed steel (#A5A9B8), with high-velocity algorithmic crests glowing in electric signal lime (#B7FF63) and subtle deep violet-iris (#A38CFF) subsurface optical refraction. Evokes a 120fps GPU shader visualization for an elite design engineering lab like Linear or Vercel. Shallow depth of field, cinematic studio lighting, zero clutter, no text, no watermarks. --ar 16:10 --stylize 300 --v 6.1
```

### Direção 03 — Constructed Forms (`constructed-forms.jpg`)
**Conceito**: Arquitetura brutalista encontra engenharia de precisão CNC e camadas ópticas de vidro.

```text
Minimalist architectural macro photography combining Tadao Ando brutalist board-formed micro-concrete and Dieter Rams / Teenage Engineering precision CNC-machined matte black anodized aluminum (#0B0F14, #151B22) with a cantilevered slab of smoked optical glass. Dramatic razor-sharp architectural shadows, crisp 45-degree chamfers, and a single recessed micro-channel emitting a focused, calibrated line of electric signal lime light (#B7FF63) against a warm bone-white (#F2F1ED) sunlit concrete edge. High-contrast, tactile material honesty, ultra-clean studio composition, no text, no letters, no watermarks. --ar 16:10 --stylize 200 --v 6.1
```

### Direção 04 (Nova na v2.0) — Kinetic Interfaces (`interface-systems.jpg`)
**Conceito**: Arquitetura de UI/UX moderna de ultra-baixa latência, planos de vidro escuro e curvas Bézier.

```text
Isometric macro studio photography of precision-engineered dark frosted glass UI planes and ultra-thin carbon-graphite layers (#0B0F14, #151B22) floating in millimeter-accurate alignment. Features 1px specular metallic hairline borders, subtle micro-grid etchings, a glowing electric lime (#B7FF63) precision bezier spline curve with geometric anchor nodes, and soft iris-violet (#A38CFF) optical caustic refraction through layered glass cards. Evokes the pinnacle of modern 120Hz UI/UX craft inspired by Linear, Raycast, and Apple Design Resources. No readable text or letters—only pure geometric UI primitives, grid lines, and optical glass layers. --ar 16:10 --stylize 250 --v 6.1
```

---

## 5. Variações de Prompt para os Temas Alternativos de Cor

Caso deseje gerar ativos visuais alinhados aos **Temas Alternativos de Tokens** incluídos na v2.0, substitua os tokens cromáticos do Bloco 2:

- **Para o Tema 02 (`Cyber Infrared`)**:
  Substitua `electric signal lime (#B7FF63)` por `calibrated international infrared orange (#FF5526)` e `violet-iris (#A38CFF)` por `warm laser amber (#FFB020)` sobre fundo `carbon titanium (#090B0E)`.
- **Para o Tema 03 (`Quantum Cyan`)**:
  Substitua `electric signal lime (#B7FF63)` por `bioluminescent quantum cyan (#00F0FF)` e `violet-iris (#A38CFF)` por `electric cobalt indigo (#818CF8)` sobre fundo `deep void navy (#070B12)`.


---

## 6. Expansão da Biblioteca de Prompts (Studies 05 a 12)

### Direção 05 — Optical Typography (`optical-typography.jpg`)
**Conceito**: O monograma geométrico `N` esculpido como um prisma óptico de vidro fumê e alumínio anodizado, refratando feixes cáusticos em verde Signal (`#B7FF63`) e violeta Iris (`#A38CFF`).

```text
Macro studio photography of a monolithic, precision-milled smoked optical glass and matte black anodized aluminum (#0B0F14, #151B22) geometric sculpture forming an abstract architectural 'N' prism on a dark obsidian surface. A single calibrated beam of warm bone-white light (#F2F1ED) enters the glass prism and refracts into a razor-sharp electric signal lime (#B7FF63) laser caustic line and a soft violet-iris (#A38CFF) spectral dispersion on the matte dark floor. Micro-etched millimeter calibration ticks on the glass edge. No readable text, no watermarks. Hasselblad macro lens, shallow depth of field. --ar 16:10 --stylize 250 --v 6.1
```

### Direção 06 — Tactile Precision (`tactile-hardware.jpg`)
**Conceito**: Engenharia tátil de resposta zero-latência (`0.1ms`), combinando titânio recartilhado a diamante, anel de safira óptica e indicador laser calibrado.

```text
Extreme macro studio photography inspired by Teenage Engineering, Leica, and Dieter Rams. A precision CNC-machined matte black titanium rotary dial and low-profile anodized dark charcoal (#151B22) mechanical interface module recessed into a seamless obsidian (#0B0F14) chassis. Features diamond-knurled metallic textures in brushed steel (#A5A9B8), an embedded sapphire optical glass ring, and a single razor-sharp electric signal lime (#B7FF63) laser-illuminated index mark with subtle warm bone (#F2F1ED) rim lighting. Zero text, zero numbers, zero letters, no watermarks—pure tactile hardware-software craft. --ar 16:10 --stylize 200 --v 6.1
```

### Direção 07 — Neural Topology (`neural-topology.jpg`)
**Conceito**: Topologia espacial de grafos, sistemas distribuídos de baixa latência e redes de conhecimento do Nummio Research.

```text
Macro 3D Octane render of an intricate, high-precision spatial node-graph topology suspended in deep obsidian darkness (#0B0F14). Composed of faceted smoked-glass polyhedrons and satin bone-white (#F2F1ED) micro-spheres connected by taut, hair-thin metallic and fiber-optic tension filaments. A primary computational path across the graph pulses with electric signal lime (#B7FF63) light while secondary cluster nodes refract subtle iris violet (#A38CFF) caustics. Shallow depth of field, cinematic studio lighting, no text, no watermarks. --ar 16:10 --stylize 280 --v 6.1
```

### Direção 08 — Cymatic Resonance (`cymatic-resonance.jpg`)
**Conceito**: Ondas estacionárias harmônicas e física de fluidos magnéticos iluminadas por horizonte laser.

```text
High-speed macro studio photography of a dark metallic ferrofluid and liquid obsidian-mercury surface (#0B0F14, #151B22) sculpted by a precision magnetic field into mathematically perfect concentric harmonic standing waves and geometric Chladni peaks. Dramatic directional rim lighting in warm bone white (#F2F1ED) and steel (#A5A9B8), with a razor-thin laser horizon line in electric signal lime (#B7FF63) reflecting across the glossy harmonic crests and a hint of iris violet (#A38CFF) specular grazing light. No text, no letters, no watermarks. --ar 16:10 --stylize 250 --v 6.1
```

### Direção 09 — Infrared Telemetry (`theme-cyber-infrared.jpg` — Tema Alternativo A)
**Conceito**: Camadas isométricas de UI em vidro escuro e titânio aplicando os tokens do **Theme 02 (`Cyber Infrared`)**.

```text
Isometric macro studio photography of precision-engineered dark carbon-titanium and frosted obsidian glass UI planes (#090B0E, #12161F) floating in millimeter alignment. Features 1px specular metallic hairline borders, radial radar grid etchings, a glowing International Infrared Orange (#FF5526) precision spline wave and active nodes, and warm Laser Amber (#FFB020) optical refraction through layered smoked glass cards. Inspired by Teenage Engineering, Linear, and cockpit avionics UI craft. Zero text, zero letters, no watermarks. --ar 16:10 --stylize 250 --v 6.1
```

### Direção 10 — Quantum Manifold (`theme-quantum-cyan.jpg` — Tema Alternativo B)
**Conceito**: Pipeline de shaders WebGPU a 120fps e lâminas ópticas aplicando os tokens do **Theme 03 (`Quantum Cyan`)**.

```text
Macro 3D Houdini/Octane render of an ultra-high-density algorithmic ribbon manifold and optical glass fins suspended in a deep void navy darkness (#070B12, #0F1724). Composed of precision carbon-slate lamellae, crisp ice-white (#EFF5FB) micro-nodes, and bioluminescent Quantum Cyan (#00F0FF) laser flow lines refracting through electric Cobalt Indigo (#818CF8) optical glass layers. Evokes a real-time 120fps WebGPU shader profiler. Shallow depth of field, studio lighting, no text, no watermarks. --ar 16:10 --stylize 300 --v 6.1
```

### Direção 11 — Architectural Daylight (`theme-architectural-bone.jpg` — Tema Alternativo C Light)
**Conceito**: Arquitetura de galeria em luz natural sobre pedra travertino e concreto warm-bone aplicando os tokens do **Theme 04 (`Architectural Bone`)**.

```text
Minimalist sunlit gallery macro photography combining warm alabaster micro-concrete and honed travertine stone blocks (#F4F3EE, #EAE8E0) with a precision-recessed matte graphite (#0B0F14) anodized aluminum channel and a cantilevered clear frosted optical glass prism. Crisp natural architectural shadows, Dieter Rams / Tadao Ando geometric purity, and a single vibrant Acid Moss / Signal Lime (#58B800, #B7FF63) optical laser refraction line and subtle deep iris (#6E56CF) glass edge tint. No text, no letters, no watermarks. --ar 16:10 --stylize 200 --v 6.1
```

### Direção 12 — Algorithmic Blueprint (`algorithmic-blueprint.jpg` — CAD & Bezier Telemetry)
**Conceito**: Diagrama paramétrico de precisão matemática, curvas Bézier cúbicas com alças de tangência e anéis astrolábicos de calibração em 120Hz.
*(Gerado programaticamente em super-amostragem 3200×2000 com bloom óptico para precisão geométrica absoluta).*
