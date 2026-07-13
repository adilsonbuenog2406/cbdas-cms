<?php

$escape = static function ($value) {
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
};

?>

<?php if (!empty($props['headline'])) : ?>
    <h1><?= $escape($props['headline']) ?></h1>
<?php endif; ?>

<?php if (!empty($props['subtitle'])) : ?>
    <p><?= $escape($props['subtitle']) ?></p>
<?php endif; ?>

<?php if (!empty($props['about_title'])) : ?>
    <h2><?= $escape($props['about_title']) ?></h2>
<?php endif; ?>

<?php if (!empty($props['about_text'])) : ?>
    <p><?= $escape($props['about_text']) ?></p>
<?php endif; ?>

<?php if (!empty($props['schedule_title'])) : ?>
    <h2><?= $escape($props['schedule_title']) ?></h2>
<?php endif; ?>

<?php if (!empty($props['schedule_items'])) : ?>
    <p><?= $escape($props['schedule_items']) ?></p>
<?php endif; ?>

<?php if (!empty($props['speakers_title'])) : ?>
    <h2><?= $escape($props['speakers_title']) ?></h2>
<?php endif; ?>

<?php if (!empty($props['speakers_items'])) : ?>
    <p><?= $escape($props['speakers_items']) ?></p>
<?php endif; ?>

<?php if (!empty($props['articles_title'])) : ?>
    <h2><?= $escape($props['articles_title']) ?></h2>
<?php endif; ?>

<?php if (!empty($props['contact_title'])) : ?>
    <h2><?= $escape($props['contact_title']) ?></h2>
<?php endif; ?>

<?php if (!empty($props['contact_email'])) : ?>
    <p><?= $escape($props['contact_email']) ?></p>
<?php endif; ?>
