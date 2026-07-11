<?php

return [
    'name' => 'teste_idasan',
    'title' => 'Teste IDASAN',
    'group' => 'IDASAN',
    'icon' => 'code',
    'element' => true,
    'width' => 500,

    'templates' => [
        'render' => __DIR__ . '/template.php',
    ],

    'defaults' => [
        'content' => 'Elemento de teste carregado.',
    ],

    'fields' => [
        'content' => [
            'label' => 'Conteúdo',
            'type' => 'textarea',
            'attrs' => ['rows' => 4],
        ],
    ],

    'fieldset' => [
        'default' => [
            'fields' => [
                'content',
            ],
        ],
    ],
];
