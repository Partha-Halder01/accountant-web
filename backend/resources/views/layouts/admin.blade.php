<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'EasyAcct Admin')</title>
    <style>
        :root {
            color-scheme: light;
            --bg: #f4efe6;
            --panel: #fffdfa;
            --panel-alt: #f8f3eb;
            --text: #1d3128;
            --muted: #637267;
            --border: #dccfb9;
            --accent: #27543e;
            --gold: #c19434;
            --danger: #9f3a2f;
            --success: #2d6b4f;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background:
                radial-gradient(circle at top left, rgba(193, 148, 52, 0.15), transparent 25%),
                linear-gradient(180deg, #f8f4ed 0%, var(--bg) 100%);
            color: var(--text);
        }

        a {
            color: inherit;
        }

        .shell {
            max-width: 1280px;
            margin: 0 auto;
            padding: 32px 20px 48px;
        }

        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
        }

        .eyebrow {
            margin: 0 0 6px;
            font-size: 12px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--muted);
        }

        .title {
            margin: 0;
            font-size: clamp(28px, 4vw, 40px);
            line-height: 1.1;
        }

        .subtitle {
            margin: 8px 0 0;
            color: var(--muted);
            max-width: 720px;
            line-height: 1.5;
        }

        .panel {
            background: rgba(255, 253, 250, 0.92);
            border: 1px solid var(--border);
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(39, 84, 62, 0.08);
        }

        .btn,
        button,
        input,
        select,
        textarea {
            font: inherit;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 11px 18px;
            border-radius: 999px;
            border: 1px solid transparent;
            text-decoration: none;
            cursor: pointer;
        }

        .btn-primary {
            background: var(--accent);
            color: white;
        }

        .btn-secondary {
            background: var(--panel-alt);
            border-color: var(--border);
            color: var(--text);
        }

        .btn-danger {
            background: var(--danger);
            color: white;
        }

        .btn-full {
            width: 100%;
        }

        .flash,
        .error-list {
            margin-bottom: 18px;
            padding: 14px 16px;
            border-radius: 16px;
            border: 1px solid;
        }

        .flash-success {
            background: #eef8f1;
            border-color: #cce5d4;
            color: var(--success);
        }

        .error-list {
            background: #fff0ee;
            border-color: #efc3bc;
            color: var(--danger);
        }

        .error-list ul {
            margin: 0;
            padding-left: 18px;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }

        .badge-new {
            background: #fdf2d6;
            color: #8a6410;
        }

        .badge-in_progress {
            background: #dcedf7;
            color: #295d82;
        }

        .badge-closed {
            background: #dff0e7;
            color: #296447;
        }

        .field {
            display: grid;
            gap: 8px;
            margin-bottom: 16px;
        }

        .field label {
            font-size: 13px;
            color: var(--muted);
            font-weight: 700;
        }

        .field input,
        .field select,
        .field textarea {
            width: 100%;
            padding: 12px 14px;
            border-radius: 14px;
            border: 1px solid var(--border);
            background: white;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
            outline: 2px solid rgba(39, 84, 62, 0.18);
            border-color: var(--accent);
        }

        @media (max-width: 768px) {
            .shell {
                padding-inline: 14px;
            }

            .topbar {
                align-items: flex-start;
                flex-direction: column;
            }
        }
    </style>
    @stack('styles')
</head>
<body>
    <div class="shell">
        <div class="topbar">
            <div>
                <p class="eyebrow">EasyAcct Admin Panel</p>
                <h1 class="title">@yield('page_title', 'Admin')</h1>
                <p class="subtitle">@yield('page_subtitle', 'Manage website inquiries from one place.')</p>
            </div>

            @auth
                <form method="POST" action="{{ route('admin.logout') }}">
                    @csrf
                    <button class="btn btn-danger" type="submit">Logout</button>
                </form>
            @endauth
        </div>

        @if (session('status'))
            <div class="flash flash-success">{{ session('status') }}</div>
        @endif

        @yield('content')
    </div>
</body>
</html>
