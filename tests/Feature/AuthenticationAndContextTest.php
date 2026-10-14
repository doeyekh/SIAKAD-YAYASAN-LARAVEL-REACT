<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationAndContextTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_and_get_school_context(): void
    {
        $user = User::where('email', 'admin.sma@alhikmah.sch.id')->firstOrFail();
        $sma = School::where('slug', 'sma-plus-al-hikmah-1')->firstOrFail();

        $response = $this->post('/login', [
            'email' => 'admin.sma@alhikmah.sch.id',
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect('/');
        $response->assertSessionHas('active_school_id', $sma->id);
        $response->assertSessionHas('active_role', 'school_admin');
    }

    public function test_users_can_switch_context_to_assigned_roles(): void
    {
        $guruUser = User::where('email', 'guru.sma@alhikmah.sch.id')->firstOrFail();
        $sma = School::where('slug', 'sma-plus-al-hikmah-1')->firstOrFail();

        $response = $this->actingAs($guruUser)->post('/switch-context', [
            'school_id' => $sma->id,
            'role' => 'homeroom_teacher',
        ]);

        $response->assertSessionHas('active_role', 'homeroom_teacher');
        $response->assertSessionHas('success');
    }

    public function test_user_can_logout(): void
    {
        $user = User::where('email', 'admin.sma@alhikmah.sch.id')->firstOrFail();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/login');
    }
}
