<?php

namespace App\Models\Scopes;

use App\Services\SchoolContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class SchoolScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);

        if ($context->isScopeDisabled()) {
            return;
        }

        // If foundation level user without specific school selection, do not filter (consolidated view)
        if ($context->isFoundationLevel() && $context->getSchoolId() === null) {
            return;
        }

        $schoolId = $context->getSchoolId();

        if ($schoolId !== null) {
            $builder->where($model->qualifyColumn('school_id'), $schoolId);
        } else {
            // Prevent data leakage if no school context is active
            $builder->whereRaw('1 = 0');
        }
    }
}
