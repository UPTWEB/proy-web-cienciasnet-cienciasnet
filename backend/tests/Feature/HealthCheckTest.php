<?php

declare(strict_types=1);

it('reports availability without exposing configuration', function () {
    $this->getJson('/health')
        ->assertOk()
        ->assertExactJson(['status' => 'ok']);
});
