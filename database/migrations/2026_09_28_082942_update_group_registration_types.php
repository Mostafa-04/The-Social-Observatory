<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. تحويل ENUM مؤقتًا إلى VARCHAR
        DB::statement("
            ALTER TABLE group_registrations
            MODIFY group_type VARCHAR(50) NOT NULL
        ");

        // 2. تحويل المجموعات القديمة إلى المجموعات الجديدة
        DB::statement("
            UPDATE group_registrations
            SET group_type = CASE group_type
                WHEN 'jeunesse' THEN 'human_capital'
                WHEN 'femmes' THEN 'gender_inclusion'
                WHEN 'vieillissement' THEN 'health_social_protection'
                WHEN 'pacte' THEN 'governance_democracy'
                ELSE group_type
            END
        ");

        // 3. إنشاء ENUM جديد يحتوي على المجموعات الخمس
        DB::statement("
            ALTER TABLE group_registrations
            MODIFY group_type ENUM(
                'human_capital',
                'gender_inclusion',
                'health_social_protection',
                'mobility_migration',
                'governance_democracy'
            ) NOT NULL
        ");
    }

    public function down(): void
    {
        // تحويل ENUM إلى VARCHAR مؤقتًا
        DB::statement("
            ALTER TABLE group_registrations
            MODIFY group_type VARCHAR(50) NOT NULL
        ");

        // الرجوع إلى المجموعات القديمة
        DB::statement("
            UPDATE group_registrations
            SET group_type = CASE group_type
                WHEN 'human_capital' THEN 'jeunesse'
                WHEN 'gender_inclusion' THEN 'femmes'
                WHEN 'health_social_protection' THEN 'vieillissement'
                WHEN 'governance_democracy' THEN 'pacte'
                WHEN 'mobility_migration' THEN 'jeunesse'
                ELSE group_type
            END
        ");

       
        DB::statement("
            ALTER TABLE group_registrations
            MODIFY group_type ENUM(
                'jeunesse',
                'femmes',
                'vieillissement',
                'pacte'
            ) NOT NULL
        ");
    }
};