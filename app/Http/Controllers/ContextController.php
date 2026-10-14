<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContextController extends Controller
{
    /**
     * Switch active school and active role.
     *
     * Uses a single pre-loaded query on schoolUsers to determine
     * authorization instead of multiple separate SchoolUser queries.
     */
    public function switchContext(Request $request): RedirectResponse
    {
        $request->validate([
            'school_id' => ['nullable', 'integer', 'exists:schools,id'],
            'role' => ['required', 'string'],
        ]);

        $user = Auth::user();
        if (! $user) {
            abort(401);
        }

        $targetSchoolId = $request->input('school_id');
        $targetRole = $request->input('role');

        // Single query: load all active assignments
        $user->loadMissing('schoolUsers');
        $activeAssignments = $user->schoolUsers->where('is_active', true);

        $allowed = false;

        $superAdmin = $activeAssignments->firstWhere('role', 'super_admin');
        $foundationAdmin = $activeAssignments->firstWhere('role', 'foundation_admin');

        if ($superAdmin) {
            $allowed = true;
        } elseif ($foundationAdmin) {
            if ($targetSchoolId === null) {
                $allowed = true;
            } else {
                $allowed = School::where('id', $targetSchoolId)
                    ->where('foundation_id', $foundationAdmin->foundation_id)
                    ->exists();
            }
        } else {
            $allowed = $activeAssignments
                ->where('school_id', $targetSchoolId)
                ->where('role', $targetRole)
                ->isNotEmpty();
        }

        if (! $allowed) {
            return back()->with('error', 'Anda tidak memiliki akses ke sekolah atau peran tersebut.');
        }

        session([
            'active_school_id' => $targetSchoolId,
            'active_role' => $targetRole,
        ]);

        return back()->with('success', 'Konteks sekolah berhasil dialihkan.');
    }
}
