<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Services\SchoolContext;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    /**
     * Display a listing of audit logs for the current active school or foundation.
     */
    public function index(Request $request): Response
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);

        $schoolId = $context->getSchoolId();

        $logs = AuditLog::with(['user', 'school'])
            ->when($schoolId, function ($q, $schoolId): void {
                $q->where('school_id', $schoolId);
            })
            ->latest('created_at')
            ->paginate(20)
            ->withQueryString()
            ->through(fn ($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'entity' => class_basename($log->auditable_type),
                'entity_id' => $log->auditable_id,
                'user_name' => $log->user?->name ?? 'Sistem',
                'school_name' => $log->school?->name ?? 'Yayasan',
                'old_values' => $log->old_values,
                'new_values' => $log->new_values,
                'ip_address' => $log->ip_address,
                'created_at' => $log->created_at->format('d M Y, H:i:s'),
            ]);

        return Inertia::render('AuditLogs/Index', [
            'logs' => $logs,
        ]);
    }
}
