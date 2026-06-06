<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuditLogger
{
    public function record(Request $request, string $action, ?User $user = null, ?string $subject = null): void
    {
        DB::table('audit_logs')->insert([
            'user_id' => $user?->id,
            'action' => $action,
            'model' => User::class,
            'model_id' => $user?->id ?? substr(hash('sha256', mb_strtolower((string) $subject)), 0, 36),
            'ip' => $request->ip(),
            'created_at' => now(),
        ]);
    }
}
