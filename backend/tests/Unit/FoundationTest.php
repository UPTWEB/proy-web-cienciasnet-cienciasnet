<?php

declare(strict_types=1);

it('requires the supported PHP version', function () {
    expect(PHP_VERSION_ID)->toBeGreaterThanOrEqual(80300);
});
