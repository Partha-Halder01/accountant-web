@extends('layouts.admin')

@section('title', 'Admin Login')
@section('page_title', 'Sign In')
@section('page_subtitle', 'Use the seeded admin credentials to review contact submissions from the frontend.')

@push('styles')
    <style>
        .login-wrap {
            max-width: 480px;
            margin: 40px auto 0;
            padding: 28px;
        }

        .login-hint {
            margin: 0 0 20px;
            padding: 14px 16px;
            border-radius: 16px;
            background: var(--panel-alt);
            border: 1px solid var(--border);
            color: var(--muted);
            line-height: 1.5;
        }
    </style>
@endpush

@section('content')
    <div class="panel login-wrap">
        <div class="login-hint">
            <strong>Admin access</strong><br>
            Use the seeded credentials from <code>backend/.env</code> to sign in.
        </div>

        @if ($errors->any())
            <div class="error-list">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('admin.login.attempt') }}">
            @csrf

            <div class="field">
                <label for="email">Email</label>
                <input id="email" name="email" type="email" value="{{ old('email') }}" required autofocus>
            </div>

            <div class="field">
                <label for="password">Password</label>
                <input id="password" name="password" type="password" required>
            </div>

            <div class="field">
                <label>
                    <input type="checkbox" name="remember" value="1">
                    Keep me signed in
                </label>
            </div>

            <button class="btn btn-primary btn-full" type="submit">Open Admin Panel</button>
        </form>
    </div>
@endsection
