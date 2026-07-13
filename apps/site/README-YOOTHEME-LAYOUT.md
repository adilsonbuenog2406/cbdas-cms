# Layout YOOtheme Pro - IDASAN/CBDAS

Arquivos gerados:

- `idasan-cbdas-yootheme-layout.json`
- `idasan-cbdas-custom.css`
- `idasan-cbdas-custom.js`
- `yootheme-layout-assets/cbdas/`

## Instalação

1. Enviar os assets de `yootheme-layout-assets/cbdas/` para `/public_html/images/cbdas/`.
2. Abrir o YOOtheme Pro.
3. Ir em `Biblioteca > My Layouts`.
4. Clicar em `Carregar Esquema`.
5. Selecionar `idasan-cbdas-yootheme-layout.json`.
6. Aplicar o layout na página/artigo `iii-cbdas`.
7. Colocar o conteúdo de `idasan-cbdas-custom.css` em `YOOtheme Pro > Settings > Custom Code > CSS`.
8. Colocar o conteúdo de `idasan-cbdas-custom.js` em `YOOtheme Pro > Settings > Custom Code > Script`.
9. Salvar e limpar cache.

## Assets referenciados pelo JSON

O JSON usa caminhos no formato `images/cbdas/nome-do-arquivo`, compatíveis com Joomla quando os arquivos forem enviados para `/public_html/images/cbdas/`.

- `images/cbdas/heroasset.png`
- `images/cbdas/elementosbrasilia2.png`
- `images/cbdas/logodark.webp`
- `images/cbdas/idasansampa.webp`
- `images/cbdas/idasanpalcosampa.webp`
- `images/cbdas/plateiaidasan.webp`
- `images/cbdas/brasilia.jpeg`
- `images/cbdas/diamante.png`
- `images/cbdas/ouro.png`
- `images/cbdas/prata.png`
- `images/cbdas/apoiadores.png`
- `images/cbdas/centoeonzelogo.png`

## Estrutura do layout

O layout usa elementos nativos do Builder sempre que possível:

- `section`, `row`, `column` para estrutura
- `headline`, `text`, `image`, `button`, `grid`, `panel`, `divider`, `icon`, `list`
- `html` apenas para metadados compactos, faixa de acessos rápidos e links sociais

## Observações

- O CSS está escopado com `.cbdas-landing`.
- O JS não executa lógica porque o layout não depende de comportamento customizado.
- A landing original do repositório não foi sobrescrita.
