<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Foundation;
use App\Models\School;
use App\Models\SchoolUser;
use App\Models\Semester;
use App\Models\Student;
use App\Models\StudentEnrollment;
use App\Models\Subject;
use App\Models\SubjectAssignment;
use App\Models\Teacher;
use App\Models\User;
use App\Services\SchoolContext;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Foundation
        $foundation = Foundation::create([
            'name' => 'Yayasan Pendidikan Al-Hikmah',
            'slug' => 'al-hikmah',
            'email' => 'sekretariat@alhikmah.sch.id',
            'phone' => '022-7231456',
            'address' => 'Jl. Rancabolang No. 45, Bandung',
            'is_active' => true,
        ]);

        // 2. School A: SMA Plus Al-Hikmah 1
        $sma = School::create([
            'foundation_id' => $foundation->id,
            'npsn' => '20104561',
            'name' => 'SMA Plus Al-Hikmah 1',
            'slug' => 'sma-plus-al-hikmah-1',
            'educational_level' => 'SMA',
            'email' => 'sma@alhikmah.sch.id',
            'phone' => '022-7231457',
            'address' => 'Jl. Rancabolang No. 45 Blok A, Bandung',
            'is_active' => true,
        ]);

        // 3. School B: SMP Al-Hikmah
        $smp = School::create([
            'foundation_id' => $foundation->id,
            'npsn' => '20104562',
            'name' => 'SMP Al-Hikmah',
            'slug' => 'smp-al-hikmah',
            'educational_level' => 'SMP',
            'email' => 'smp@alhikmah.sch.id',
            'phone' => '022-7231458',
            'address' => 'Jl. Rancabolang No. 45 Blok B, Bandung',
            'is_active' => true,
        ]);

        $defaultPassword = Hash::make('password');

        // 4. Users & Roles
        // Super Admin
        $superAdminUser = User::create([
            'name' => 'Super Administrator',
            'email' => 'superadmin@alhikmah.sch.id',
            'password' => $defaultPassword,
            'phone' => '08122000001',
            'is_active' => true,
        ]);
        SchoolUser::create([
            'user_id' => $superAdminUser->id,
            'school_id' => null,
            'foundation_id' => null,
            'role' => 'super_admin',
            'is_active' => true,
        ]);

        // Foundation Admin
        $foundationAdminUser = User::create([
            'name' => 'H. Abdullah Syafi\'i, M.M.',
            'email' => 'admin.yayasan@alhikmah.sch.id',
            'password' => $defaultPassword,
            'phone' => '08122000002',
            'is_active' => true,
        ]);
        SchoolUser::create([
            'user_id' => $foundationAdminUser->id,
            'school_id' => null,
            'foundation_id' => $foundation->id,
            'role' => 'foundation_admin',
            'is_active' => true,
        ]);

        // Kepala Sekolah SMA
        $kepsekSmaUser = User::create([
            'name' => 'Dra. Hj. Nur Laila, M.Pd',
            'email' => 'kepsek.sma@alhikmah.sch.id',
            'password' => $defaultPassword,
            'phone' => '08122000003',
            'is_active' => true,
        ]);
        SchoolUser::create([
            'user_id' => $kepsekSmaUser->id,
            'school_id' => $sma->id,
            'foundation_id' => $foundation->id,
            'role' => 'principal',
            'is_active' => true,
        ]);

        // Admin TU SMA
        $adminSmaUser = User::create([
            'name' => 'Ahmad Fauzi, S.Kom',
            'email' => 'admin.sma@alhikmah.sch.id',
            'password' => $defaultPassword,
            'phone' => '08122000004',
            'is_active' => true,
        ]);
        SchoolUser::create([
            'user_id' => $adminSmaUser->id,
            'school_id' => $sma->id,
            'foundation_id' => $foundation->id,
            'role' => 'school_admin',
            'is_active' => true,
        ]);

        // Guru SMA
        $guruSmaUser = User::create([
            'name' => 'Bambang S., S.Pd',
            'email' => 'guru.sma@alhikmah.sch.id',
            'password' => $defaultPassword,
            'phone' => '08122000005',
            'is_active' => true,
        ]);
        SchoolUser::create([
            'user_id' => $guruSmaUser->id,
            'school_id' => $sma->id,
            'foundation_id' => $foundation->id,
            'role' => 'teacher',
            'is_active' => true,
        ]);
        SchoolUser::create([
            'user_id' => $guruSmaUser->id,
            'school_id' => $sma->id,
            'foundation_id' => $foundation->id,
            'role' => 'homeroom_teacher',
            'is_active' => true,
        ]);

        // Kepala Sekolah SMP
        $kepsekSmpUser = User::create([
            'name' => 'Drs. H. Mulyadi, M.Pd',
            'email' => 'kepsek.smp@alhikmah.sch.id',
            'password' => $defaultPassword,
            'phone' => '08122000006',
            'is_active' => true,
        ]);
        SchoolUser::create([
            'user_id' => $kepsekSmpUser->id,
            'school_id' => $smp->id,
            'foundation_id' => $foundation->id,
            'role' => 'principal',
            'is_active' => true,
        ]);

        // Admin SMP
        $adminSmpUser = User::create([
            'name' => 'Dewi Lestari, S.Pd',
            'email' => 'admin.smp@alhikmah.sch.id',
            'password' => $defaultPassword,
            'phone' => '08122000007',
            'is_active' => true,
        ]);
        SchoolUser::create([
            'user_id' => $adminSmpUser->id,
            'school_id' => $smp->id,
            'foundation_id' => $foundation->id,
            'role' => 'school_admin',
            'is_active' => true,
        ]);

        // 5. Populate Data for SMA using SchoolContext
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);
        $context->withoutScope(function () use ($sma, $smp, $guruSmaUser): void {
            // Academic Year & Semester for SMA
            $aySma = AcademicYear::create([
                'school_id' => $sma->id,
                'name' => '2026/2027',
                'start_date' => '2026-07-15',
                'end_date' => '2027-06-25',
                'is_active' => true,
            ]);

            Semester::create([
                'school_id' => $sma->id,
                'academic_year_id' => $aySma->id,
                'semester' => 'ganjil',
                'start_date' => '2026-07-15',
                'end_date' => '2026-12-20',
                'is_active' => true,
            ]);

            // Teacher SMA
            $teacherSma = Teacher::create([
                'school_id' => $sma->id,
                'user_id' => $guruSmaUser->id,
                'nip' => '198501102008011005',
                'nuptk' => '9876543210123456',
                'full_name' => 'Bambang S., S.Pd',
                'gender' => 'L',
                'title_suffix' => 'S.Pd',
                'phone' => '08122000005',
                'email' => 'guru.sma@alhikmah.sch.id',
                'is_active' => true,
            ]);

            // Classrooms SMA
            $classX = Classroom::create([
                'school_id' => $sma->id,
                'academic_year_id' => $aySma->id,
                'name' => 'X MIPA 1',
                'grade_level' => '10',
                'homeroom_teacher_id' => $teacherSma->id,
            ]);

            Classroom::create([
                'school_id' => $sma->id,
                'academic_year_id' => $aySma->id,
                'name' => 'X MIPA 2',
                'grade_level' => '10',
                'homeroom_teacher_id' => null,
            ]);

            Classroom::create([
                'school_id' => $sma->id,
                'academic_year_id' => $aySma->id,
                'name' => 'XI MIPA 1',
                'grade_level' => '11',
                'homeroom_teacher_id' => null,
            ]);

            // Subjects SMA
            $subBio = Subject::create([
                'school_id' => $sma->id,
                'code' => 'BIO-10',
                'name' => 'Biologi',
                'grade_level' => '10',
                'kkm' => 75.00,
            ]);

            Subject::create([
                'school_id' => $sma->id,
                'code' => 'MTK-10',
                'name' => 'Matematika Peminatan',
                'grade_level' => '10',
                'kkm' => 75.00,
            ]);

            // Subject Assignment
            SubjectAssignment::create([
                'school_id' => $sma->id,
                'teacher_id' => $teacherSma->id,
                'subject_id' => $subBio->id,
                'classroom_id' => $classX->id,
                'academic_year_id' => $aySma->id,
            ]);

            // Students SMA
            $student1 = Student::create([
                'school_id' => $sma->id,
                'nisn' => '0078491290',
                'nis' => '262710001',
                'full_name' => 'Fahri Ramadhan',
                'gender' => 'L',
                'birth_place' => 'Bandung',
                'birth_date' => '2010-05-12',
                'religion' => 'Islam',
                'address' => 'Jl. Buah Batu No. 10, Bandung',
                'status' => 'active',
            ]);

            $student2 = Student::create([
                'school_id' => $sma->id,
                'nisn' => '0078491291',
                'nis' => '262710002',
                'full_name' => 'Annisa Zahra',
                'gender' => 'P',
                'birth_place' => 'Bandung',
                'birth_date' => '2010-08-22',
                'religion' => 'Islam',
                'address' => 'Jl. Soekarno Hatta No. 112, Bandung',
                'status' => 'active',
            ]);

            StudentEnrollment::create([
                'school_id' => $sma->id,
                'student_id' => $student1->id,
                'classroom_id' => $classX->id,
                'academic_year_id' => $aySma->id,
                'roll_number' => 1,
                'status' => 'enrolled',
            ]);

            StudentEnrollment::create([
                'school_id' => $sma->id,
                'student_id' => $student2->id,
                'classroom_id' => $classX->id,
                'academic_year_id' => $aySma->id,
                'roll_number' => 2,
                'status' => 'enrolled',
            ]);

            // 6. Populate Data for SMP (School B)
            $aySmp = AcademicYear::create([
                'school_id' => $smp->id,
                'name' => '2026/2027',
                'start_date' => '2026-07-15',
                'end_date' => '2027-06-25',
                'is_active' => true,
            ]);

            Semester::create([
                'school_id' => $smp->id,
                'academic_year_id' => $aySmp->id,
                'semester' => 'ganjil',
                'start_date' => '2026-07-15',
                'end_date' => '2026-12-20',
                'is_active' => true,
            ]);

            $classSmp = Classroom::create([
                'school_id' => $smp->id,
                'academic_year_id' => $aySmp->id,
                'name' => 'VII A',
                'grade_level' => '7',
            ]);

            Classroom::create([
                'school_id' => $smp->id,
                'academic_year_id' => $aySmp->id,
                'name' => 'VII B',
                'grade_level' => '7',
            ]);

            $teacherSmp = Teacher::create([
                'school_id' => $smp->id,
                'nip' => '198902142010012003',
                'full_name' => 'Siti Aminah, M.Pd',
                'gender' => 'P',
                'title_suffix' => 'M.Pd',
                'phone' => '08122000008',
                'email' => 'siti.aminah@alhikmah.sch.id',
                'is_active' => true,
            ]);

            $studentSmp = Student::create([
                'school_id' => $smp->id,
                'nisn' => '0091234567',
                'nis' => '262707001',
                'full_name' => 'Dimas Anggara',
                'gender' => 'L',
                'birth_place' => 'Cimahi',
                'birth_date' => '2013-03-10',
                'religion' => 'Islam',
                'address' => 'Jl. Cibabat No. 5, Cimahi',
                'status' => 'active',
            ]);

            StudentEnrollment::create([
                'school_id' => $smp->id,
                'student_id' => $studentSmp->id,
                'classroom_id' => $classSmp->id,
                'academic_year_id' => $aySmp->id,
                'roll_number' => 1,
                'status' => 'enrolled',
            ]);
        });
    }
}
