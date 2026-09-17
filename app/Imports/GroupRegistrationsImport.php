<?php

namespace App\Imports;

use App\Models\GroupRegistration;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class GroupRegistrationsImport implements ToModel, WithHeadingRow
{
    public int $importedCount = 0;

    public function model(array $row)
    {
        $this->importedCount++;

        return new GroupRegistration([
            'full_name'        => $row['nom'] ?? null,
            'email'            => $row['email'] ?? null,
            'group_type'       => $row['groupe'] ?? null,
            'linkedin_url'     => $row['linkedin'] ?? null,
            'presentation'     => $row['presentation'] ?? null,
            'expertise_domain' => $row['expertise'] ?? null,
            'motivation'       => $row['motivation'] ?? null,
            'cv_path'          => $row['cv'] ?? null,
            'created_at'       => $row['date_dinscription'] ?? now(),
        ]);
    }
}