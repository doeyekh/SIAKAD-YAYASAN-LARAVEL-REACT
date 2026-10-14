<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\ContextController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Foundation\AcademicYearManagementController;
use App\Http\Controllers\Foundation\RoleManagementController;
use App\Http\Controllers\Foundation\SchoolManagementController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/switch-context', [ContextController::class, 'switchContext'])->name('switch-context');
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Foundation Admin & Global Management
    Route::prefix('foundation')->name('foundation.')->group(function () {
        Route::resource('schools', SchoolManagementController::class);
        Route::resource('role-assignments', RoleManagementController::class)->parameters(['role-assignments' => 'assignment']);
        Route::get('academic-years', [AcademicYearManagementController::class, 'index'])->name('academic-years.index');
        Route::post('academic-years', [AcademicYearManagementController::class, 'store'])->name('academic-years.store');
        Route::post('academic-years/{academicYear}/activate', [AcademicYearManagementController::class, 'activate'])->name('academic-years.activate');
        Route::post('academic-years/{academicYear}/semesters/{semester}/activate', [AcademicYearManagementController::class, 'toggleSemester'])->name('academic-years.toggle-semester');
    });

    // Master Data & Kesiswaan (F-02, F-03, F-04)
    Route::resource('students', StudentController::class);
    Route::post('teachers/import', [TeacherController::class, 'import'])->name('teachers.import');
    Route::resource('teachers', TeacherController::class);
    Route::resource('classrooms', ClassroomController::class);
    Route::resource('subjects', SubjectController::class);

    // Audit Trail
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
});
