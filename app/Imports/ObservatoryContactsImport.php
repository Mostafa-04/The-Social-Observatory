<?php

namespace App\Imports;

use App\Models\ObservatoryContact;
use Carbon\Carbon;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ObservatoryContactsImport implements
    ToModel,
    WithHeadingRow,
    WithValidation
{
    public function model(array $row)
    {
        return new ObservatoryContact([
            'name' => $row['nom'] ?? null,

            'organisation' => $row['organisation'] ?? null,

            'role' => $row['role'] ?? null,

            'email' => $row['email'] ?? null,

            'phone' => isset($row['telephone'])
                ? (string) $row['telephone']
                : null,

            'status' => $this->convertStatus(
                $row['statut'] ?? null
            ),

            'registered_at' => $this->parseDate(
                $row['date_dinscription'] ?? null
            ),

            'approved_at' => $this->parseDate(
                $row['approuve_le'] ?? null
            ),

            'rejected_at' => $this->parseDate(
                $row['rejete_le'] ?? null
            ),
        ]);
    }

    /**
     * Convert Excel French status
     * to application status.
     */
    private function convertStatus(?string $status): string
    {
        $status = trim((string) $status);

        return match ($status) {

            'Approuvé',
            'Approuve',
            'approved' => 'approved',

            'Rejeté',
            'Rejete',
            'rejected' => 'rejected',

            'En attente',
            'pending' => 'pending',

            default => 'pending',
        };
    }

    /**
     * Parse Excel dates.
     */
    private function parseDate($date): ?Carbon
    {
        if (empty($date)) {
            return null;
        }

        try {
            return Carbon::parse($date);
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Excel validation.
     */
    public function rules(): array
    {
        return [
            'nom' => [
                'required',
                'string',
                'max:255',
            ],

            'organisation' => [
                'nullable',
                'string',
                'max:255',
            ],

            'role' => [
                'nullable',
                'string',
                'max:255',
            ],

            'email' => [
                'nullable',
                'email',
                'max:255',
            ],

            /*
             * Excel peut envoyer le téléphone
             * comme number ou string.
             */
            'telephone' => [
                'nullable',
            ],

            /*
             * IMPORTANT:
             * On ne met PAS Rule::in(['pending', ...])
             * ici car Excel contient:
             *
             * Approuvé
             * En attente
             * Rejeté
             */
            'statut' => [
                'nullable',
                'string',
            ],

            'date_dinscription' => [
                'nullable',
            ],

            'approuve_le' => [
                'nullable',
            ],

            'rejete_le' => [
                'nullable',
            ],
        ];
    }
}