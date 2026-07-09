# Importacao do Layout YOOtheme - IDASAN / III CBDAS

Arquivos desta entrega:

- `idasan-cbdas-yootheme-layout.json`
- `idasan-cbdas-custom.css`
- `idasan-cbdas-custom.js`
- `yootheme-layout-assets/cbdas/`

## Passo a passo

1. Enviar os arquivos de `yootheme-layout-assets/cbdas/` para `/public_html/images/cbdas/`.
2. Abrir o Joomla Admin.
3. Abrir o YOOtheme Pro.
4. Ir em `Biblioteca > My Layouts`.
5. Clicar em `Carregar Esquema`.
6. Selecionar `idasan-cbdas-yootheme-layout.json`.
7. Abrir a pagina/artigo `iii-cbdas`.
8. Aplicar o layout usando `Substituir layout`.
9. Colar o conteudo de `idasan-cbdas-custom.css` em `YOOtheme > Settings > Custom Code > CSS`.
10. Colar o conteudo de `idasan-cbdas-custom.js` em `YOOtheme > Settings > Custom Code > Script`.
11. Salvar.
12. Limpar cache do Joomla/YOOtheme.
13. Testar desktop, tablet e mobile.

## Assets

O JSON e o CSS usam caminhos no formato `images/cbdas/nome-do-arquivo`.

Arquivos que devem existir em `/public_html/images/cbdas/`:

- `apoiadores.png`
- `brasilia.jpeg`
- `centoeonzelogo.png`
- `diamante.png`
- `heroasset.png`
- `idasanpalcosampa.webp`
- `idasansampa.webp`
- `logodark.webp`
- `ouro.png`
- `plateiaidasan.webp`
- `prata.png`

## Estrutura do layout

O layout usa elementos nativos do YOOtheme sempre que possivel:

- `section`, `row`, `column` para estrutura.
- `headline`, `text`, `image`, `button`, `grid`, `panel`, `divider`, `icon` para conteudo editavel.
- Hero com logo, data, local, arte III CBDAS, titulo, subtitulo e botoes editaveis.
- Programacao com cada horario como `panel` individual.
- Patrocinadores e apoiadores como imagens em `grid`.
- Footer com textos, links e botoes sociais editaveis.

## Limitações conhecidas

- Alguns efeitos visuais da landing React original, como animacoes de entrada, typewriter e camadas de fundo muito complexas, foram simplificados para preservar editabilidade no Builder.
- Os links sociais foram convertidos para botoes nativos em vez de `social`, porque o projeto nao contem um export real desse elemento para confirmar o schema exato.
- A fidelidade visual fina depende da aplicacao do CSS customizado escopado em `.cbdas-landing`.
