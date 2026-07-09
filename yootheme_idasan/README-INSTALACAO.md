# Instalação do Child Theme IDASAN/CBDAS

Esta pasta é um YOOtheme Child Theme para Joomla com um Custom Element editável chamado **CBDAS Landing**.

## Como instalar

1. Fazer upload da pasta `yootheme_idasan` para `/public_html/templates/`.
2. No Joomla, abrir `YOOtheme Pro > Settings > Advanced > Child Theme`.
3. Selecionar `yootheme_idasan`, salvar e recarregar o Builder.
4. Criar ou abrir a página da landing no YOOtheme.
5. Adicionar o elemento em `Add Element > IDASAN > CBDAS Landing`.
6. Selecionar imagens e editar os campos nas abas `Hero`, `Botões`, `Seções`, `Footer` e `Avançado`.
7. Salvar a página.

## Estrutura

```txt
yootheme_idasan/
├── css/custom.css
├── js/custom.js
├── images/cbdas/
└── builder/cbdas_landing/
    ├── element.php
    ├── images/icon.svg
    ├── images/iconSmall.svg
    └── templates/
        ├── template.php
        └── content.php
```

## Campos de listas

Alguns campos usam uma linha por item para manter o elemento simples e editável:

- Programação: `Dia|Horário|Título|Tipo`
- Palestrantes: `Nome|Cargo|Imagem`
- Dados de empenho: `Rótulo|Valor`

Use caminhos como `templates/yootheme_idasan/images/cbdas/heroasset.png` para assets do child theme, ou selecione imagens pelo campo de mídia do YOOtheme.

## Observações técnicas

- O CSS está escopado em `.cbdas-landing`.
- O JavaScript busca elementos apenas dentro de `.cbdas-landing`.
- O template escapa os valores dinâmicos com `htmlspecialchars`.
- A landing original do repositório não foi alterada.
