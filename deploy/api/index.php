<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Laravel/Symfony strips the base URL derived from SCRIPT_NAME from the path.
// Our front controller lives at /api/index.php, so by default Laravel sees
// "settings/public" — but routes/api.php registers them as "api/settings/public"
// (auto-prefixed by withRouting()). Override SCRIPT_NAME so the full /api/...
// path reaches the router.
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF']    = '/index.php';

$root = __DIR__ . '/../_laravel';

if (file_exists($maintenance = $root . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $root . '/vendor/autoload.php';

/** @var Application $app */
$app = require_once $root . '/bootstrap/app.php';

$app->handleRequest(Request::capture());
