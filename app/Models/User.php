<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'nik',
        'avatar',
        'is_active',
        'teacher_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'nik' => 'encrypted',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the school user role assignments.
     */
    public function schoolUsers(): HasMany
    {
        return $this->hasMany(SchoolUser::class);
    }

    /**
     * Get the schools associated with the user.
     */
    public function schools(): BelongsToMany
    {
        return $this->belongsToMany(School::class, 'school_users')->withPivot('role', 'is_active')->withTimestamps();
    }

    /**
     * Get teacher profile if any.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    /**
     * Get student profile if any.
     */
    public function student(): HasOne
    {
        return $this->hasOne(Student::class);
    }

    /**
     * Check if user is super admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->schoolUsers()->where('role', 'super_admin')->where('is_active', true)->exists();
    }

    /**
     * Check if user is foundation admin.
     */
    public function isFoundationAdmin(): bool
    {
        return $this->schoolUsers()->where('role', 'foundation_admin')->where('is_active', true)->exists();
    }
}
