# Debug do Custom Element CBDAS Landing

Esta pasta deve ser enviada exatamente para:

```txt
/public_html/templates/yootheme_idasan
```

O YOOtheme Pro carrega elementos customizados automaticamente a partir da pasta `builder` do child theme ativo. Portanto, depois do upload, ative o child theme em:

```txt
YOOtheme Pro > Settings > Advanced > Child Theme > yootheme_idasan
```

Depois salve as configurações e atualize o navegador.

## O que foi corrigido

1. O arquivo `builder/cbdas_landing/element.php` original foi preservado como:

```txt
builder/cbdas_landing/element-original-backup.php
```

2. O `element.php` ativo foi refeito com uma configuração mais conservadora:

- mantém `name`, `title`, `group`, `icon`, `iconSmall`, `element`, `width` e `templates`;
- usa apenas tipos de campo básicos (`text`, `textarea`, `image`, `checkbox`);
- remove tipos/flags menos essenciais para reduzir risco de incompatibilidade no carregamento;
- mantém os defaults principais da landing para o `template.php` atual renderizar.

3. Foi criado um elemento mínimo isolado para diagnóstico:

```txt
builder/teste_idasan/element.php
builder/teste_idasan/template.php
```

Esse elemento deve aparecer como:

```txt
IDASAN > Teste IDASAN
```

## Como interpretar

Se `Teste IDASAN` aparece, mas `CBDAS Landing` não aparece:

- o child theme está sendo lido;
- o problema está especificamente no elemento `cbdas_landing`;
- verifique erro PHP relacionado a `cbdas_landing/element.php`, `template.php` ou `content.php`.

Se nem `Teste IDASAN` aparece:

- o YOOtheme não está lendo o child theme ativo;
- confirme se a pasta está em `/public_html/templates/yootheme_idasan`;
- confirme se está ao lado de `/public_html/templates/yootheme`;
- confirme se o child theme `yootheme_idasan` está selecionado e salvo em Settings > Advanced;
- limpe caches do Joomla, YOOtheme, OPcache, LiteSpeed/Hostinger e Cloudflare, se houver.

## Validação PHP no servidor

No ambiente local deste repositório não havia binário `php`, então rode estes comandos no servidor:

```bash
php -l /public_html/templates/yootheme_idasan/builder/cbdas_landing/element.php
php -l /public_html/templates/yootheme_idasan/builder/cbdas_landing/templates/template.php
php -l /public_html/templates/yootheme_idasan/builder/cbdas_landing/templates/content.php
php -l /public_html/templates/yootheme_idasan/builder/teste_idasan/element.php
php -l /public_html/templates/yootheme_idasan/builder/teste_idasan/template.php
```

Todos devem retornar:

```txt
No syntax errors detected
```

## Permissões recomendadas

```bash
find /public_html/templates/yootheme_idasan -type d -exec chmod 755 {} \;
find /public_html/templates/yootheme_idasan -type f -exec chmod 644 {} \;
```

## Limpeza de cache

Depois do upload:

1. Joomla > Sistema > Limpar Cache
2. YOOtheme Pro > Settings > Advanced > Save
3. Limpar OPcache/PHP-FPM, se disponível
4. Limpar LiteSpeed/Hostinger/Cloudflare, se houver
5. Fazer hard refresh no navegador

## Onde procurar no Builder

Abra:

```txt
YOOtheme Pro > Page Builder > Add Element > Elements
```

Procure pelo grupo:

```txt
IDASAN
```

Os elementos esperados são:

```txt
CBDAS Landing
Teste IDASAN
```
