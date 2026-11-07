# Nummio v2.0 — Tipografia & Especificação OpenType

## Fontes Oficiais Recomendadas (Não Redistribuídas)
- **Display & Headlines**: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) *(Pesos: 500 Medium, 600 SemiBold, 700 Bold)*
- **UI & Leitura Densa (12px–16px)**: [Inter / Inter Display](https://rsms.me/inter/) *(Pesos: 400 Regular, 500 Medium, 600 SemiBold)*
- **Telemetria, Código & Metadados**: [Geist Mono](https://vercel.com/font) ou [JetBrains Mono](https://www.jetbrains.com/lp/mono/) *(Pesos: 400 Regular, 500 Medium, 600 SemiBold)*

## Configuração CSS Recomendada para Alta Performance de UI

```css
/* Headlines & Brand Display */
.nummio-display {
  font-family: var(--nummio-font-display);
  letter-spacing: -0.03em;
  line-height: 1.08;
  font-feature-settings: "ss01" 1, "cv01" 1;
  -webkit-font-smoothing: antialiased;
}

/* Dense UI Controls & Body */
.nummio-ui {
  font-family: var(--nummio-font-sans);
  letter-spacing: -0.011em;
  line-height: 1.5;
  font-feature-settings: "cv02" 1, "cv03" 1, "cv04" 1, "cv11" 1;
}

/* Real-Time Telemetry, Shortcuts & Code */
.nummio-mono {
  font-family: var(--nummio-font-mono);
  font-variant-numeric: tabular-nums slashed-zero;
  font-feature-settings: "tnum" 1, "zero" 1;
  letter-spacing: 0.04em;
}
```
