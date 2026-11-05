# Nummio Design Tokens v1.1 — Implementação

## Estrutura
- `tokens.css`: fonte canônica; primitivas e tokens semânticos light/dark.
- `tokens.json`: manifesto para ferramentas, **não** importe como CSS.
- `tailwind-v4.css`: ponte opcional para Tailwind CSS v4 (`@theme inline`).
- `base.css`: estilos básicos opcionais, sem componentes React.

## Next.js / Tailwind v4
1. Coloque os assets no repositório sem renomear; por exemplo `src/assets/brand/` ou `public/brand/`.
2. Em `app/globals.css`, importe na ordem:

```css
@import "tailwindcss";
@import "../assets/brand/system/tokens.css";
@import "../assets/brand/system/tailwind-v4.css";
@import "../assets/brand/system/base.css";
```

Adapte os caminhos à estrutura real; se `base.css` for usado, deixe-o por último.
3. Use `next/font/google` para Space Grotesk e `next/font/local` para Geist Mono **somente se houver licença e arquivos locais**; caso contrário use a fonte oficial via pacote adequado. Sem arquivos locais, prefira `next/font/google` para Space Grotesk e `geist/font/mono` para Geist Mono.
4. O tema padrão é dark. Para light, aplique `data-theme="light"` no `html`, com persistência em localStorage e script de inicialização para evitar flash. Para dark remova o atributo ou use `data-theme="dark"`.
5. Elementos interativos devem consumir variáveis `--nm-*` semânticas (`--nm-accent`, `--nm-fg`), não cores hex no JSX.

## Tailwind (exemplos)
- `bg-background text-foreground`
- `bg-surface border-line`
- `bg-accent text-accent-foreground`
- `text-muted`, `font-mono`

## Acessibilidade e estilo
- O verde de marca `#B7FF63` não é a cor de texto de ações no tema claro: use `--nm-accent`.
- Não adicione blur/movimento de rolagem pesado nem falso terminal; prefira transições pequenas.
- Respeite `prefers-reduced-motion`; alvos interativos >=44px.
- Imagens do kit são estudos criativos, não registros históricos.

## Estrutura de produto
- Nummio = marca guarda-chuva; Nummio Labs = experimentos; Nummio Research = editoriais.
- `nexus.nummio.dev`, `ion.nummio.dev`, `labs.nummio.dev` são exemplos de namespace.
