<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('scholarship_notifications', function (Blueprint $table) {
            $table->index(['user_id', 'read_at', 'created_at'], 'idx_scholarship_notifications_user_read_created');
            $table->index(['user_id', 'type'], 'idx_scholarship_notifications_user_type');
            $table->index(['notifiable_type', 'notifiable_id'], 'idx_scholarship_notifications_notifiable');
        });

        Schema::table('application_comments', function (Blueprint $table) {
            $table->index(['application_id', 'created_at'], 'idx_application_comments_application_created');
            $table->index(['application_id', 'type'], 'idx_application_comments_application_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('application_comments', function (Blueprint $table) {
            $table->dropIndex('idx_application_comments_application_created');
            $table->dropIndex('idx_application_comments_application_type');
        });

        Schema::table('scholarship_notifications', function (Blueprint $table) {
            $table->dropIndex('idx_scholarship_notifications_user_read_created');
            $table->dropIndex('idx_scholarship_notifications_user_type');
            $table->dropIndex('idx_scholarship_notifications_notifiable');
        });
    }
};
