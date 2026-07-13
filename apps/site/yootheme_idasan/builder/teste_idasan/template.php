<?php

$content = htmlspecialchars((string) ($props['content'] ?? ''), ENT_QUOTES, 'UTF-8');

?>

<div style="padding:40px;background:#071231;color:white;border-radius:12px;">
    <?= $content ?>
</div>
