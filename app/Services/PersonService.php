<?php

namespace App\Services;

use App\Models\Person;
use Illuminate\Support\Str;

class PersonService
{
    /**
     * Champs que le service a le droit de créer / mettre à jour.
     */
    private const UPDATABLE_FIELDS = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'gender',
        'organisation',
        'role',
        'country',
        'linkedin',
    ];

    /**
     * Retourne un Person existant (recherche par email, puis par téléphone)
     * ou en crée un nouveau.
     *
     * Si la personne existe déjà, ses informations sont mises à jour :
     *  - valeur reçue non vide  => elle remplace l'ancienne (ou remplit le champ vide)
     *  - valeur reçue vide      => l'ancienne valeur est conservée
     */
    public function findOrCreate(array $data): Person
    {
        $email = $this->normalize('email', $data['email'] ?? null);
        $phone = $this->normalize('phone', $data['phone'] ?? null);

        $person = null;

        // Recherche par email d'abord
        if ($email) {
            $person = Person::where('email', $email)->first();
        }

        // Puis par téléphone si rien n'a été trouvé
        if (!$person && $phone) {
            $person = Person::where('phone', $phone)->first();
        }

        // Personne trouvée : on met à jour ses informations
        if ($person) {
            return $this->update($person, $data);
        }

        // Ni email ni téléphone : identifiant factice unique
        if (!$email && !$phone) {
            $email = 'noemail_' . Str::uuid() . '@placeholder.local';
        }

        return Person::create([
            'first_name'   => $this->normalize('first_name', $data['first_name'] ?? null) ?? '',
            'last_name'    => $this->normalize('last_name', $data['last_name'] ?? null) ?? '',
            'email'        => $email,
            'phone'        => $phone,
            'gender'       => $this->normalize('gender', $data['gender'] ?? null),
            'organisation' => $this->normalize('organisation', $data['organisation'] ?? null),
            'role'         => $this->normalize('role', $data['role'] ?? null),
            'country'      => $this->normalize('country', $data['country'] ?? null),
            'linkedin'     => $this->normalize('linkedin', $data['linkedin'] ?? null),
        ]);
    }

    /**
     * Met à jour une personne existante avec les nouvelles valeurs.
     */
    public function update(Person $person, array $data): Person
    {
        $updateData = [];

        foreach (self::UPDATABLE_FIELDS as $field) {
            $value = $this->normalize($field, $data[$field] ?? null);

            // Valeur vide : on ne touche pas à l'ancienne valeur
            if ($value === null) {
                continue;
            }

            // Valeur identique : rien à faire
            if ((string) $person->{$field} === $value) {
                continue;
            }

            // email / phone doivent rester uniques : on ignore si déjà pris par quelqu'un d'autre
            if (
                in_array($field, ['email', 'phone'], true)
                && $this->isTakenByAnotherPerson($field, $value, $person)
            ) {
                continue;
            }

            $updateData[$field] = $value;
        }

        if (!empty($updateData)) {
            $person->update($updateData);
        }

        return $person;
    }

    /**
     * Recherche une personne sans la créer.
     */
    public function find(array $criteria): ?Person
    {
        $query = Person::query();

        if (!empty($criteria['email'])) {
            return $query->where('email', strtolower(trim($criteria['email'])))->first();
        }

        if (!empty($criteria['phone'])) {
            return $query->where('phone', trim($criteria['phone']))->first();
        }

        return null;
    }

    /**
     * trim() la valeur ; retourne null si elle est vide.
     * L'email est mis en minuscules.
     * (on n'utilise pas empty() car il considère "0" comme vide)
     */
    private function normalize(string $field, mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim((string) $value);

        if ($value === '') {
            return null;
        }

        return $field === 'email' ? strtolower($value) : $value;
    }

    /**
     * Vérifie qu'un autre Person n'utilise pas déjà cet email / téléphone.
     */
    private function isTakenByAnotherPerson(string $field, string $value, Person $person): bool
    {
        return Person::where($field, $value)
            ->where($person->getKeyName(), '!=', $person->getKey())
            ->exists();
    }
}