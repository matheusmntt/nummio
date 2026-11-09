# Nou · mascote da Nummio

**Nou** vem do grego *nous* (νοῦς), o intelecto: a parte da mente que compreende. *Nou* (νοῦ) é a forma "do intelecto", a mesma raiz de onde saiu o nome Nummio. Para Anaxágoras, o Nous é a mente que põe o caos em movimento e o transforma em ordem, o que é o método da Nummio: **Explore → Understand → Build**.

## Conceito

O Nou é o **módulo Signal** do símbolo, o quadrado lime acima do N, que ganhou vida e saiu para explorar. No símbolo, ele fica acima da letra como a mente acima do corpo (`nou-home.svg`).

- **Corpo:** o módulo Signal ampliado. Um quadrado com a mesma proporção de canto do símbolo (`rx` = 3.2 / 15.5 do lado).
- **Olhos:** barras verticais em grafite, as hastes do N em miniatura. Sem boca e sem membros: a expressão vem do olhar, da inclinação e da cor.
- **Acessórios:** são sempre módulos. Faíscas, pensamentos e blocos que ele empilha usam a mesma geometria.
- **Grid:** 100 unidades, o mesmo do símbolo. Corpo de 58, centrado na horizontal, com uma sombra leve no chão.

## Personalidade

Um assistente de laboratório curioso. Fala pouco e com precisão, como o lab report. Faz perguntas antes de responder e comemora quando algo vai ao ar. Nunca é sarcástico com quem errou: quando algo cai, ele avisa e fica de olho.

## Humores

Cada humor corresponde a uma cor de status do servidor e do site, então o Nou pode fazer o papel das luzes.

| Arquivo | Humor | Cor | Uso |
| :--- | :--- | :--- | :--- |
| `nou-neutral.svg` | Neutral | Signal `#B7FF63` | Padrão, tudo em ordem. |
| `nou-curious.svg` | Curious | Signal | Explore: olha para um módulo no alto. |
| `nou-thinking.svg` | Thinking | Iris `#A38CFF` | Understand: os pensamentos sobem como módulos. |
| `nou-building.svg` | Building | Signal | Build: olhar focado, empilhando módulos. |
| `nou-shipped.svg` | Shipped | Signal | Marcos: decisão aceita, produto no ar, peça publicada. |
| `nou-alert.svg` | Alert | Infrared `#FF5526` | Erro ou site fora do ar. |
| `nou-worried.svg` | Worried | Amber `#FFB020` | Aviso: certificado vencendo, renovação chegando. |
| `nou-sleeping.svg` | Sleeping | Charcoal com contorno Steel | Desligado ou ainda não checado. |
| `nou-home.svg` | Home | Símbolo | O Nou no lugar dele, como o módulo do N. |

`nou-sheet.png` mostra cada humor no tamanho de arte, de avatar (64px) e de emoji (22px), em fundo escuro e claro.

## Regras de uso

- **Onde ele aparece:** na Nummio (site, Discord, artigos, perfis). O Olho no Voto tem identidade própria; nele, o Nou aparece no máximo junto da assinatura "Engineered by Nummio".
- **Cores:** só as do tema Signal Core, e cada uma com o significado da tabela. Lime nunca indica erro, e infrared nunca indica sucesso.
- **Formas:** sem boca, braços, roupas ou contornos pretos grossos. Se precisar de um objeto, use um módulo.
- **O símbolo:** o Nou não substitui o símbolo nem o wordmark. Ele acompanha a marca; não é a marca.

## Gerar de novo

A geometria está em `scripts/render-mascot.mjs`. Depois de mudá-la, rode `pnpm brand:mascot`, que reescreve os SVGs e a prancha.
