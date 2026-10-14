<?php

namespace App\Models;

use App\Models\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Guardian extends Model
{
    use BelongsToSchool, HasFactory;

    protected $fillable = [
        'school_id',
        'user_id',
        'student_id',
        'name',
        'relationship',
        'phone',
        'occupation',
        'address',
    ];

    /**
     * Get user account linked to this guardian.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get student this guardian represents.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
