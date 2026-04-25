<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_homepage_redirects_to_the_admin_panel(): void
    {
        $response = $this->get('/');

        $response->assertRedirect('/admin');
    }

    public function test_a_contact_message_can_be_submitted_through_the_api(): void
    {
        $response = $this->postJson('/api/contact', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+1 555 0100',
            'service' => 'Business Tax Return',
            'message' => 'I need help with quarterly filings.',
        ]);

        $response
            ->assertCreated()
            ->assertJson([
                'message' => 'Your inquiry has been saved successfully.',
            ]);

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'jane@example.com',
            'status' => 'new',
        ]);
    }

    public function test_admin_can_login_and_view_contact_messages_from_frontend_api(): void
    {
        $this->seed();

        $this->postJson('/api/contact', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+1 555 0100',
            'service' => 'Business Tax Return',
            'message' => 'I need help with quarterly filings.',
        ]);

        $loginResponse = $this->postJson('/api/admin/login', [
            'email' => 'admin@easyacct.us',
            'password' => 'ChangeMe123!',
        ]);

        $loginResponse->assertOk()->assertJsonStructure(['token']);

        $messagesResponse = $this
            ->withToken($loginResponse->json('token'))
            ->getJson('/api/admin/messages');

        $messagesResponse
            ->assertOk()
            ->assertJsonPath('messages.data.0.email', 'jane@example.com');
    }

    public function test_admin_can_change_password_from_frontend_api(): void
    {
        $this->seed();

        $loginResponse = $this->postJson('/api/admin/login', [
            'email' => 'admin@easyacct.us',
            'password' => 'ChangeMe123!',
        ]);

        $this
            ->withToken($loginResponse->json('token'))
            ->patchJson('/api/admin/password', [
                'email' => 'admin@easyacct.us',
                'current_password' => 'ChangeMe123!',
                'password' => 'NewSecure123',
                'password_confirmation' => 'NewSecure123',
            ])
            ->assertOk()
            ->assertJsonPath('message', 'Admin password updated successfully.');

        $this->postJson('/api/admin/login', [
            'email' => 'admin@easyacct.us',
            'password' => 'NewSecure123',
        ])->assertOk();
    }
}
