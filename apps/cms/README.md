# CBDAS CMS

Painel administrativo Next.js para editar, exportar e publicar a landing page do III CBDAS.

## Desenvolvimento

```bash
pnpm dev:cms
```

## Build

O build do CMS executa o build do site, sincroniza `apps/site/dist`, gera manifesto/ZIP e depois compila o Next.js:

```bash
pnpm build:cms
```

## Publicação SFTP

O botão `Publicar` usa a última versão salva pelo editor e publica por SFTP com release temporária, validação, backup, ativação e rollback automático.

Em produção/serverless, configure Supabase para persistir a versão salva. Sem Supabase, o CMS só usa arquivos locais para desenvolvimento ou servidores Node com disco persistente.

Configure as variáveis abaixo somente no ambiente server-side do CMS:

```env
SFTP_HOST=
SFTP_PORT=22
SFTP_USERNAME=
SFTP_PRIVATE_KEY=
SFTP_PRIVATE_KEY_PASSPHRASE=
SFTP_PASSWORD=
SFTP_HOST_FINGERPRINT=
SFTP_REMOTE_PATH=/public_html/iii-congresso-brasileiro-de-direito-administrativo-sancionador
PUBLIC_LANDING_PAGE_URL=https://idasan.com.br/iii-congresso-brasileiro-de-direito-administrativo-sancionador/
SFTP_CONNECTION_TIMEOUT=30000
SFTP_READY_TIMEOUT=30000
SFTP_KEEP_BACKUPS=3
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
CMS_SUPABASE_BUCKET=cms
CMS_REQUIRE_PERSISTENT_STORAGE=true
```

Preferir `SFTP_PRIVATE_KEY`. Use `SFTP_PASSWORD` apenas quando chave privada não estiver disponível. Nunca use prefixo `NEXT_PUBLIC_` para credenciais.

Rode a migration em `supabase/migrations/20260714132843_cms_editor_persistence.sql` no projeto Supabase. Ela cria:

- `cms_editor_current`: versão atual usada por `/cms/editor`, `/cms/preview` e publicação SFTP.
- `cms_editor_revisions`: histórico de cada clique em `Salvar`.
- bucket privado `cms` para fallback de storage e uploads.

`SUPABASE_SERVICE_ROLE_KEY` deve ficar somente no ambiente server-side do CMS. Nunca use `NEXT_PUBLIC_` nessa chave.

## Preview

Depois de salvar no editor, acesse `/cms/preview` para ver a última versão persistida. É essa mesma versão que será publicada pelo SFTP.

## Produção

Em servidor Node persistente, a publicação roda em background e mantém histórico/lock em `data/deployments`.
Em Vercel/serverless, a publicação roda inline dentro da request para não depender de worker persistente, usa `/tmp` para histórico/lock efêmeros e o endpoint define `maxDuration = 300`.

Use `CMS_PUBLISH_EXECUTION_MODE=background` somente quando o runtime tiver um worker/processo persistente. Use `CMS_DEPLOYMENTS_DIR` para apontar o histórico de publicação para outro diretório gravável.
