@extends('layouts.admin')

@php
    $statusLabels = [
        'new' => 'New',
        'in_progress' => 'In Progress',
        'closed' => 'Closed',
    ];
@endphp

@section('title', 'Contact Dashboard')
@section('page_title', 'Contact Dashboard')
@section('page_subtitle', 'Frontend contact form submissions are stored here for follow-up and status tracking.')

@push('styles')
    <style>
        .stats-grid,
        .dashboard-grid {
            display: grid;
            gap: 18px;
        }

        .stats-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            margin-bottom: 24px;
        }

        .stat-card {
            padding: 20px;
        }

        .stat-card strong {
            display: block;
            font-size: 14px;
            color: var(--muted);
            margin-bottom: 10px;
        }

        .stat-card span {
            font-size: 32px;
            font-weight: 700;
        }

        .dashboard-grid {
            grid-template-columns: minmax(0, 1.6fr) minmax(320px, 0.9fr);
            align-items: start;
        }

        .panel-section {
            padding: 22px;
        }

        .filters {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr auto;
            gap: 12px;
            margin-bottom: 18px;
        }

        .filters .field {
            margin-bottom: 0;
        }

        .table-wrap {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            padding: 14px 10px;
            border-bottom: 1px solid var(--border);
            text-align: left;
            vertical-align: top;
        }

        th {
            font-size: 12px;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }

        .message-link {
            text-decoration: none;
            color: inherit;
        }

        .message-link strong {
            display: block;
            margin-bottom: 4px;
        }

        .message-preview,
        .meta-line {
            color: var(--muted);
            line-height: 1.5;
        }

        .message-preview {
            max-width: 420px;
        }

        .detail-card {
            position: sticky;
            top: 24px;
        }

        .detail-card h2 {
            margin-top: 0;
            margin-bottom: 12px;
            font-size: 24px;
        }

        .detail-list {
            display: grid;
            gap: 14px;
            margin: 18px 0;
        }

        .detail-list div {
            padding-bottom: 12px;
            border-bottom: 1px solid var(--border);
        }

        .detail-list strong {
            display: block;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--muted);
            margin-bottom: 6px;
        }

        .empty-state {
            padding: 20px;
            border-radius: 16px;
            background: var(--panel-alt);
            color: var(--muted);
        }

        .pagination {
            display: flex;
            gap: 10px;
            margin-top: 18px;
        }

        @media (max-width: 1080px) {
            .stats-grid,
            .dashboard-grid {
                grid-template-columns: 1fr;
            }

            .detail-card {
                position: static;
            }
        }

        @media (max-width: 720px) {
            .filters {
                grid-template-columns: 1fr;
            }
        }
    </style>
@endpush

@section('content')
    <section class="stats-grid">
        <div class="panel stat-card">
            <strong>Total Messages</strong>
            <span>{{ $stats['total'] }}</span>
        </div>
        <div class="panel stat-card">
            <strong>New</strong>
            <span>{{ $stats['new'] }}</span>
        </div>
        <div class="panel stat-card">
            <strong>In Progress</strong>
            <span>{{ $stats['in_progress'] }}</span>
        </div>
        <div class="panel stat-card">
            <strong>Closed</strong>
            <span>{{ $stats['closed'] }}</span>
        </div>
    </section>

    <section class="dashboard-grid">
        <div class="panel panel-section">
            <form class="filters" method="GET" action="{{ route('admin.dashboard') }}">
                <div class="field">
                    <label for="search">Search messages</label>
                    <input id="search" name="search" type="text" value="{{ $filters['search'] }}" placeholder="Name, email, phone, service">
                </div>

                <div class="field">
                    <label for="status">Status</label>
                    <select id="status" name="status">
                        <option value="">All statuses</option>
                        @foreach ($statusLabels as $value => $label)
                            <option value="{{ $value }}" @selected($filters['status'] === $value)>{{ $label }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="field" style="align-self: end;">
                    <button class="btn btn-primary btn-full" type="submit">Filter</button>
                </div>
            </form>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Sender</th>
                            <th>Service</th>
                            <th>Status</th>
                            <th>Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($messages as $message)
                            <tr>
                                <td>
                                    <a
                                        class="message-link"
                                        href="{{ route('admin.dashboard', array_filter(['search' => $filters['search'], 'status' => $filters['status'], 'message' => $message->id], fn ($value) => $value !== null && $value !== '')) }}"
                                    >
                                        <strong>{{ $message->name }}</strong>
                                        <div class="meta-line">{{ $message->email }}</div>
                                        <div class="meta-line">{{ $message->phone }}</div>
                                    </a>
                                </td>
                                <td>
                                    <div>{{ $message->service }}</div>
                                    <div class="message-preview">{{ \Illuminate\Support\Str::limit($message->message, 80) }}</div>
                                </td>
                                <td>
                                    <span class="badge badge-{{ $message->status }}">{{ $statusLabels[$message->status] ?? ucfirst($message->status) }}</span>
                                </td>
                                <td>{{ $message->created_at->format('M d, Y h:i A') }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4">
                                    <div class="empty-state">No contact submissions matched the current filters.</div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            @if ($messages->hasPages())
                <div class="pagination">
                    @if ($messages->previousPageUrl())
                        <a class="btn btn-secondary" href="{{ $messages->previousPageUrl() }}">Previous</a>
                    @endif

                    @if ($messages->nextPageUrl())
                        <a class="btn btn-secondary" href="{{ $messages->nextPageUrl() }}">Next</a>
                    @endif
                </div>
            @endif
        </div>

        <aside class="panel panel-section detail-card">
            @if ($selectedMessage)
                <span class="badge badge-{{ $selectedMessage->status }}">{{ $statusLabels[$selectedMessage->status] ?? ucfirst($selectedMessage->status) }}</span>
                <h2>{{ $selectedMessage->name }}</h2>
                <p class="subtitle" style="margin-top: 0;">
                    Review the message details and update the progress status for your team.
                </p>

                <div class="detail-list">
                    <div>
                        <strong>Email</strong>
                        <a href="mailto:{{ $selectedMessage->email }}">{{ $selectedMessage->email }}</a>
                    </div>
                    <div>
                        <strong>Phone</strong>
                        <a href="tel:{{ $selectedMessage->phone }}">{{ $selectedMessage->phone }}</a>
                    </div>
                    <div>
                        <strong>Service</strong>
                        {{ $selectedMessage->service }}
                    </div>
                    <div>
                        <strong>Submitted At</strong>
                        {{ $selectedMessage->created_at->format('M d, Y h:i A') }}
                    </div>
                    <div>
                        <strong>Message</strong>
                        {{ $selectedMessage->message }}
                    </div>
                </div>

                <form method="POST" action="{{ route('admin.messages.status', $selectedMessage) }}">
                    @csrf
                    @method('PATCH')

                    <div class="field">
                        <label for="detail-status">Update status</label>
                        <select id="detail-status" name="status">
                            @foreach ($statusLabels as $value => $label)
                                <option value="{{ $value }}" @selected($selectedMessage->status === $value)>{{ $label }}</option>
                            @endforeach
                        </select>
                    </div>

                    <button class="btn btn-primary btn-full" type="submit">Save Status</button>
                </form>
            @else
                <div class="empty-state">
                    New submissions from the frontend contact form will appear here once visitors start sending messages.
                </div>
            @endif
        </aside>
    </section>
@endsection
