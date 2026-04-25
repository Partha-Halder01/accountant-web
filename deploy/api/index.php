<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$root = __DIR__ . '/../_laravel';

if (file_exists($maintenance = $root . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $root . '/vendor/autoload.php';

/** @var Application $app */
$app = require_once $root . '/bootstrap/app.php';

$app->handleRequest(Request::capture());
