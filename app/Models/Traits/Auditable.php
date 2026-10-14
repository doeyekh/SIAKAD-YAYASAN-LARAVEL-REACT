<?php

namespace App\Models\Traits;

use App\Services\AuditLogger;

trait Auditable
{
    /**
     * Boot the Auditable trait.
     */
    protected static function bootAuditable(): void
    {
        static::created(function ($model): void {
            AuditLogger::log('created', $model, null, $model->getAttributes());
        });

        static::updated(function ($model): void {
            $dirty = $model->getDirty();
            $original = array_intersect_key($model->getOriginal(), $dirty);
            AuditLogger::log('updated', $model, $original, $dirty);
        });

        static::deleted(function ($model): void {
            AuditLogger::log('deleted', $model, $model->getOriginal(), null);
        });
    }
}
