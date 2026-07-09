<?php

if (!function_exists('cbdas_e')) {
    function cbdas_e($value) {
        return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('cbdas_media')) {
    function cbdas_media($path) {
        $path = trim((string) $path);

        if (!$path) {
            return '';
        }

        if (preg_match('#^(https?:)?//#', $path)) {
            return $path;
        }

        return '/' . ltrim($path, '/');
    }
}

if (!function_exists('cbdas_url')) {
    function cbdas_url($path) {
        $path = trim((string) $path);

        if (!$path) {
            return '';
        }

        if (preg_match('#^(https?:)?//#', $path) || preg_match('#^(mailto|tel):#i', $path) || strpos($path, '#') === 0) {
            return $path;
        }

        return '/' . ltrim($path, '/');
    }
}

if (!function_exists('cbdas_lines')) {
    function cbdas_lines($value) {
        $lines = preg_split('/\R/u', (string) $value);
        return array_values(array_filter(array_map('trim', $lines), static function ($line) {
            return $line !== '';
        }));
    }
}

if (!function_exists('cbdas_paragraphs')) {
    function cbdas_paragraphs($value) {
        $chunks = preg_split('/\R{2,}/u', trim((string) $value));
        return array_values(array_filter(array_map('trim', $chunks), static function ($line) {
            return $line !== '';
        }));
    }
}

if (!function_exists('cbdas_parse_rows')) {
    function cbdas_parse_rows($value, $columns) {
        $rows = [];

        foreach (cbdas_lines($value) as $line) {
            $parts = array_map('trim', explode('|', $line));
            $row = [];

            foreach ($columns as $index => $column) {
                $row[$column] = $parts[$index] ?? '';
            }

            $rows[] = $row;
        }

        return $rows;
    }
}

if (!function_exists('cbdas_group_schedule')) {
    function cbdas_group_schedule($items) {
        $days = [];

        foreach ($items as $item) {
            $day = $item['day'] ?: 'Programação';
            $days[$day][] = $item;
        }

        return $days;
    }
}

$logo = cbdas_media($props['logo'] ?? '');
$heroImage = cbdas_media($props['hero_image'] ?? '');
$heroBackground = cbdas_media($props['hero_background_image'] ?? '');
$aboutImages = array_filter([
    cbdas_media($props['about_image_1'] ?? ''),
    cbdas_media($props['about_image_2'] ?? ''),
    cbdas_media($props['about_image_3'] ?? ''),
]);
$scheduleDays = cbdas_group_schedule(cbdas_parse_rows($props['schedule_items'] ?? '', ['day', 'time', 'title', 'type']));
$speakers = cbdas_parse_rows($props['speakers_items'] ?? '', ['name', 'role', 'image']);
$commitmentRows = cbdas_parse_rows($props['commitment_text'] ?? '', ['label', 'value']);
$sponsorImages = array_filter([
    'Diamante' => cbdas_media($props['sponsor_diamond_image'] ?? ''),
    'Ouro' => cbdas_media($props['sponsor_gold_image'] ?? ''),
    'Prata' => cbdas_media($props['sponsor_silver_image'] ?? ''),
    'Apoiadores' => cbdas_media($props['sponsor_supporters_image'] ?? ''),
]);
$locationImage = cbdas_media($props['location_image'] ?? '');
$developerLogo = cbdas_media($props['developer_logo'] ?? '');
?>

<div class="cbdas-landing" data-cbdas-landing>
    <?php if (!empty($props['show_header'])) : ?>
        <header class="cbdas-header" data-cbdas-header>
            <a class="cbdas-header__brand" href="#cbdas-hero" aria-label="Ir para o início da landing CBDAS">
                <?php if ($logo) : ?>
                    <img src="<?= cbdas_e($logo) ?>" alt="IDASAN CBDAS" loading="eager" decoding="async">
                <?php else : ?>
                    <span>IDASAN</span>
                <?php endif; ?>
            </a>
            <button class="cbdas-header__toggle" type="button" data-cbdas-menu-toggle aria-expanded="false" aria-controls="cbdas-navigation">
                <span>Menu</span>
            </button>
            <nav class="cbdas-header__nav" id="cbdas-navigation" data-cbdas-menu>
                <a href="#inscricoes-descontos">Inscrições</a>
                <a href="#programacao">Programação</a>
                <a href="#palestrantes">Palestrantes</a>
                <a href="#patrocinadores">Patrocinadores</a>
                <a href="#artigos-cientificos">Artigos</a>
                <a href="#local">Local</a>
                <a href="#contato">Contato</a>
            </nav>
        </header>
    <?php endif; ?>

    <main>
        <section class="cbdas-hero" id="cbdas-hero">
            <div class="cbdas-hero__background" <?php if ($heroBackground) : ?>style="background-image: url('<?= cbdas_e($heroBackground) ?>')"<?php endif; ?>></div>
            <div class="cbdas-hero__inner">
                <div class="cbdas-hero__meta">
                    <span><?= cbdas_e($props['event_date'] ?? '') ?></span>
                    <span><?= cbdas_e($props['event_location'] ?? '') ?></span>
                </div>

                <?php if (!empty($props['headline'])) : ?>
                    <h1 class="cbdas-sr-only"><?= nl2br(cbdas_e($props['headline'] ?? '')) ?></h1>
                <?php endif; ?>

                <?php if ($heroImage) : ?>
                    <img class="cbdas-hero__image" src="<?= cbdas_e($heroImage) ?>" alt="<?= cbdas_e($props['headline'] ?? 'IIIº CBDAS') ?>" loading="eager" decoding="async">
                <?php endif; ?>

                <div class="cbdas-hero__rule"></div>

                <?php if (!empty($props['subtitle'])) : ?>
                    <p class="cbdas-hero__subtitle" data-cbdas-typewriter><?= nl2br(cbdas_e($props['subtitle'] ?? '')) ?></p>
                <?php endif; ?>

                <div class="cbdas-hero__actions">
                    <a class="cbdas-button cbdas-button--gold" href="<?= cbdas_e(cbdas_url($props['primary_button_link'] ?? '#') ?: '#') ?>" target="_blank" rel="noopener noreferrer">
                        <?= cbdas_e($props['primary_button_text'] ?? 'Inscreva-se Agora') ?>
                    </a>
                    <div class="cbdas-hero__secondary-actions">
                        <a class="cbdas-button cbdas-button--outline" href="<?= cbdas_e(cbdas_url($props['article_button_link'] ?? '#') ?: '#') ?>" target="_blank" rel="noopener noreferrer">
                            <?= cbdas_e($props['article_button_text'] ?? 'Submissões de artigos') ?>
                        </a>
                        <a class="cbdas-button cbdas-button--outline" href="<?= cbdas_e(cbdas_url($props['instructions_button_link'] ?? '#') ?: '#') ?>" target="_blank" rel="noopener noreferrer">
                            <?= cbdas_e($props['instructions_button_text'] ?? 'Instruções para submissão de artigo') ?>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <?php if (!empty($props['show_actions_band'])) : ?>
            <section class="cbdas-actions-band" aria-label="Acessos rápidos do congresso">
                <button class="cbdas-actions-band__toggle" type="button" data-cbdas-actions-toggle aria-expanded="false">
                    Acessos rápidos
                </button>
                <div class="cbdas-actions-band__links" data-cbdas-actions-menu>
                    <a href="#inscricoes-descontos">Inscrições</a>
                    <a href="#programacao">Programação</a>
                    <a href="<?= cbdas_e(cbdas_url($props['sponsor_button_link'] ?? '#') ?: '#') ?>" target="_blank" rel="noopener noreferrer"><?= cbdas_e($props['sponsor_button_text'] ?? 'Seja um patrocinador') ?></a>
                    <a href="<?= cbdas_e(cbdas_url($props['article_button_link'] ?? '#') ?: '#') ?>" target="_blank" rel="noopener noreferrer"><?= cbdas_e($props['article_button_text'] ?? 'Submissões de artigos') ?></a>
                    <a href="<?= cbdas_e(cbdas_url($props['instructions_button_link'] ?? '#') ?: '#') ?>" target="_blank" rel="noopener noreferrer"><?= cbdas_e($props['instructions_button_text'] ?? 'Instruções para submissão de artigo') ?></a>
                    <a href="#empenho">Instruções para empenho</a>
                    <a href="#guia-cbdas">Guia IIIº CBDAS</a>
                </div>
            </section>
        <?php endif; ?>

        <section class="cbdas-about" id="guia-cbdas">
            <div class="cbdas-section-grid cbdas-section-grid--reverse">
                <div class="cbdas-about__gallery">
                    <?php foreach ($aboutImages as $index => $image) : ?>
                        <figure class="cbdas-about__photo cbdas-about__photo--<?= (int) $index + 1 ?>">
                            <img src="<?= cbdas_e($image) ?>" alt="Registro do congresso CBDAS" loading="lazy" decoding="async">
                        </figure>
                    <?php endforeach; ?>
                </div>
                <div class="cbdas-section-copy">
                    <span class="cbdas-eyebrow"><?= cbdas_e($props['about_eyebrow'] ?? '') ?></span>
                    <h2><?= cbdas_e($props['about_title'] ?? '') ?></h2>
                    <?php foreach (cbdas_paragraphs($props['about_text'] ?? '') as $paragraph) : ?>
                        <p><?= nl2br(cbdas_e($paragraph)) ?></p>
                    <?php endforeach; ?>
                    <div class="cbdas-facts">
                        <div>
                            <strong>Local</strong>
                            <span><?= cbdas_e($props['location_name'] ?? '') ?>, <?= cbdas_e($props['event_location'] ?? '') ?></span>
                        </div>
                        <div>
                            <strong>Quando</strong>
                            <span><?= cbdas_e($props['event_date'] ?? '') ?> de 2026</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="cbdas-registration" id="inscricoes-descontos">
            <div class="cbdas-section-heading cbdas-section-heading--center">
                <span class="cbdas-eyebrow">Inscrições</span>
                <h2>Inscrições para Submissões de Artigos</h2>
                <p>Confira os períodos de inscrição e os benefícios disponíveis para cada etapa.</p>
            </div>
            <div class="cbdas-pricing">
                <article>
                    <span>1ª etapa</span>
                    <strong>01/06/2026 a 30/06/2026</strong>
                    <p>100% de isenção</p>
                </article>
                <article>
                    <span>2ª etapa</span>
                    <strong>01/07/2026 a 20/07/2026</strong>
                    <p>30% de desconto</p>
                </article>
            </div>
            <a class="cbdas-button cbdas-button--primary" href="<?= cbdas_e(cbdas_url($props['primary_button_link'] ?? '#') ?: '#') ?>" target="_blank" rel="noopener noreferrer">
                <?= cbdas_e($props['primary_button_text'] ?? 'Inscreva-se') ?>
            </a>
        </section>

        <section class="cbdas-schedule" id="programacao">
            <div class="cbdas-section-heading cbdas-section-heading--center">
                <span class="cbdas-eyebrow"><?= cbdas_e($props['schedule_subtitle'] ?? '') ?></span>
                <h2><?= cbdas_e($props['schedule_title'] ?? '') ?></h2>
            </div>
            <?php if ($scheduleDays) : ?>
                <div class="cbdas-schedule__tabs" role="tablist" aria-label="Dias da programação">
                    <?php $dayIndex = 0; foreach (array_keys($scheduleDays) as $day) : ?>
                        <button type="button" class="<?= $dayIndex === 0 ? 'is-active' : '' ?>" data-cbdas-schedule-tab="<?= (int) $dayIndex ?>" role="tab" aria-selected="<?= $dayIndex === 0 ? 'true' : 'false' ?>">
                            <?= cbdas_e($day) ?>
                        </button>
                    <?php $dayIndex++; endforeach; ?>
                </div>
                <div class="cbdas-schedule__panels">
                    <?php $dayIndex = 0; foreach ($scheduleDays as $day => $items) : ?>
                        <div class="cbdas-schedule__panel <?= $dayIndex === 0 ? 'is-active' : '' ?>" data-cbdas-schedule-panel="<?= (int) $dayIndex ?>">
                            <?php foreach ($items as $item) : ?>
                                <article class="cbdas-schedule-card">
                                    <time><?= cbdas_e($item['time']) ?></time>
                                    <div>
                                        <?php if (!empty($item['type'])) : ?>
                                            <span><?= cbdas_e($item['type']) ?></span>
                                        <?php endif; ?>
                                        <h3><?= cbdas_e($item['title']) ?></h3>
                                    </div>
                                </article>
                            <?php endforeach; ?>
                        </div>
                    <?php $dayIndex++; endforeach; ?>
                </div>
            <?php endif; ?>
        </section>

        <?php if (!empty($props['show_speakers'])) : ?>
            <section class="cbdas-speakers" id="palestrantes">
                <div class="cbdas-section-heading cbdas-section-heading--center">
                    <span class="cbdas-eyebrow">Convidados</span>
                    <h2><?= cbdas_e($props['speakers_title'] ?? '') ?></h2>
                    <p><?= cbdas_e($props['speakers_text'] ?? '') ?></p>
                </div>
                <div class="cbdas-speakers__grid">
                    <?php foreach ($speakers as $speaker) : ?>
                        <article class="cbdas-speaker-card">
                            <?php $speakerImage = cbdas_media($speaker['image'] ?? ''); ?>
                            <?php if ($speakerImage) : ?>
                                <img src="<?= cbdas_e($speakerImage) ?>" alt="<?= cbdas_e($speaker['name']) ?>" loading="lazy" decoding="async">
                            <?php endif; ?>
                            <div>
                                <h3><?= cbdas_e($speaker['name']) ?></h3>
                                <p><?= cbdas_e($speaker['role']) ?></p>
                            </div>
                        </article>
                    <?php endforeach; ?>
                </div>
            </section>
        <?php endif; ?>

        <section class="cbdas-articles" id="artigos-cientificos">
            <div class="cbdas-section-heading cbdas-section-heading--center">
                <span class="cbdas-icon-badge">Artigos</span>
                <h2><?= cbdas_e($props['articles_title'] ?? '') ?></h2>
                <h3><?= cbdas_e($props['articles_subtitle'] ?? '') ?></h3>
                <p><?= cbdas_e($props['articles_text'] ?? '') ?></p>
            </div>
            <div class="cbdas-inline-actions">
                <a class="cbdas-button cbdas-button--primary" href="<?= cbdas_e(cbdas_url($props['article_button_link'] ?? '#') ?: '#') ?>" target="_blank" rel="noopener noreferrer">
                    <?= cbdas_e($props['article_button_text'] ?? 'Submissões de artigos') ?>
                </a>
                <a class="cbdas-button cbdas-button--secondary" href="<?= cbdas_e(cbdas_url($props['instructions_button_link'] ?? '#') ?: '#') ?>" target="_blank" rel="noopener noreferrer">
                    <?= cbdas_e($props['instructions_button_text'] ?? 'Instruções para submissão de artigo') ?>
                </a>
            </div>
        </section>

        <section class="cbdas-commitment" id="empenho">
            <div class="cbdas-section-heading cbdas-section-heading--center">
                <span class="cbdas-eyebrow">Dados Institucionais</span>
                <h2><?= cbdas_e($props['commitment_title'] ?? '') ?></h2>
            </div>
            <div class="cbdas-commitment__card">
                <?php foreach ($commitmentRows as $row) : ?>
                    <div class="cbdas-data-row">
                        <strong><?= cbdas_e($row['label']) ?></strong>
                        <span><?= cbdas_e($row['value']) ?></span>
                        <button type="button" data-cbdas-copy="<?= cbdas_e($row['value']) ?>">Copiar</button>
                    </div>
                <?php endforeach; ?>
                <a class="cbdas-button cbdas-button--secondary" href="<?= cbdas_e(cbdas_url($props['commitment_docs_link'] ?? '#') ?: '#') ?>" target="_blank" rel="noopener noreferrer">
                    Acessar Documentos
                </a>
            </div>
        </section>

        <?php if (!empty($props['show_location'])) : ?>
            <section class="cbdas-location" id="local">
                <div class="cbdas-section-grid">
                    <div class="cbdas-section-copy">
                        <span class="cbdas-eyebrow">Brasília - DF</span>
                        <h2><?= cbdas_e($props['location_title'] ?? '') ?></h2>
                        <div class="cbdas-location__card">
                            <h3><?= cbdas_e($props['location_name'] ?? '') ?></h3>
                            <p><?= nl2br(cbdas_e($props['location_address'] ?? '')) ?></p>
                            <a class="cbdas-button cbdas-button--secondary" href="<?= cbdas_e(cbdas_url($props['maps_link'] ?? '#') ?: '#') ?>" target="_blank" rel="noopener noreferrer">Como Chegar</a>
                        </div>
                    </div>
                    <?php if ($locationImage) : ?>
                        <figure class="cbdas-location__image">
                            <img src="<?= cbdas_e($locationImage) ?>" alt="Vista de Brasília" loading="lazy" decoding="async">
                        </figure>
                    <?php endif; ?>
                </div>
            </section>
        <?php endif; ?>

        <?php if (!empty($props['show_sponsors'])) : ?>
            <section class="cbdas-sponsors" id="patrocinadores">
                <div class="cbdas-section-heading cbdas-section-heading--center cbdas-section-heading--light">
                    <h2><?= cbdas_e($props['sponsors_title'] ?? '') ?></h2>
                </div>
                <div class="cbdas-sponsors__stack">
                    <?php foreach ($sponsorImages as $label => $image) : ?>
                        <figure>
                            <img src="<?= cbdas_e($image) ?>" alt="<?= cbdas_e($label) ?>" loading="lazy" decoding="async">
                        </figure>
                    <?php endforeach; ?>
                </div>
            </section>
        <?php endif; ?>
    </main>

    <?php if (!empty($props['show_footer'])) : ?>
        <footer class="cbdas-footer" id="contato">
            <div class="cbdas-footer__grid">
                <div>
                    <?php if ($logo) : ?>
                        <img class="cbdas-footer__logo" src="<?= cbdas_e($logo) ?>" alt="IDASAN CBDAS" loading="lazy" decoding="async">
                    <?php endif; ?>
                    <h2><?= cbdas_e($props['contact_title'] ?? '') ?></h2>
                    <p><?= cbdas_e($props['contact_text'] ?? '') ?></p>
                    <div class="cbdas-footer__social">
                        <a href="<?= cbdas_e(cbdas_url($props['instagram_link'] ?? '#') ?: '#') ?>" target="_blank" rel="noopener noreferrer">Instagram</a>
                        <a href="<?= cbdas_e(cbdas_url($props['linkedin_link'] ?? '#') ?: '#') ?>" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a href="<?= cbdas_e(cbdas_url($props['youtube_link'] ?? '#') ?: '#') ?>" target="_blank" rel="noopener noreferrer">YouTube</a>
                    </div>
                </div>
                <div>
                    <h3>Links Rápidos</h3>
                    <a href="#inscricoes-descontos">Inscrições</a>
                    <a href="#programacao">Programação</a>
                    <a href="#artigos-cientificos">Artigos</a>
                    <a href="#local">Local</a>
                </div>
                <div>
                    <h3><?= cbdas_e($props['contact_title'] ?? 'Contato') ?></h3>
                    <a href="mailto:<?= cbdas_e($props['contact_email'] ?? '') ?>"><?= cbdas_e($props['contact_email'] ?? '') ?></a>
                </div>
            </div>
            <div class="cbdas-footer__bottom">
                <p><?= cbdas_e($props['footer_text'] ?? '') ?></p>
                <?php if ($developerLogo) : ?>
                    <a href="<?= cbdas_e(cbdas_url($props['developer_link'] ?? '#') ?: '#') ?>" target="_blank" rel="noopener noreferrer" aria-label="Acessar site da Cento e Onze">
                        <span>Desenvolvido por</span>
                        <img src="<?= cbdas_e($developerLogo) ?>" alt="centoeonze" loading="lazy" decoding="async">
                    </a>
                <?php endif; ?>
            </div>
        </footer>
    <?php endif; ?>
</div>
