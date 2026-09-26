<?php

namespace App\Services;

use App\Models\Person;
use Illuminate\Support\Str;

class PersonService
{
    /**
     * retourne un Person existant basé sur l'email ou le téléphone, ou crée un nouveau Person si aucun n'est trouvé.
     */
    public function findOrCreate(array $data): Person
    {
        // email et téléphone doivent être formatés pour la recherche
        $email = !empty($data['email'])
            ? strtolower(trim($data['email']))
            : null;

        $phone = !empty($data['phone'])
            ? trim($data['phone'])
            : null;

        $person = null;

        // البحث بالبريد الإلكتروني أولاً
        if ($email) {
            $person = Person::where('email', $email)->first();
        }

        // البحث برقم الهاتف إذا لم نجد بالبريد
        if (!$person && $phone) {
            $person = Person::where('phone', $phone)->first();
        }

        // إذا وجدنا شخصاً، نرجعه
        if ($person) {
            return $person;
        }

        // التحقق من أن لدينا على الأقل بريد إلكتروني أو هاتف
        if (!$email && !$phone) {
            // إنشاء معرّف فريد للأشخاص بدون بيانات اتصال
            $email = 'noemail_' . Str::uuid() . '@placeholder.local';
        }

        // إنشاء شخص جديد
        return Person::create([
            'first_name' => $data['first_name'] ?? '',
            'last_name' => $data['last_name'] ?? '',
            'email' => $email,
            'phone' => $phone,
            'gender' => $data['gender'] ?? null,
            'organisation' => $data['organisation'] ?? null,
            'role' => $data['role'] ?? null,
            'country' => $data['country'] ?? null,
            'linkedin' => $data['linkedin'] ?? null,
        ]);
    }

    /**
     * تحديث شخص موجود بحقول جديدة
     */
    public function update(Person $person, array $data): Person
    {
        $updateData = [];

        $allowedFields = [
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

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $value = $data[$field];

                if (!empty($value)) {
                    if ($field === 'email') {
                        $updateData[$field] = strtolower(trim($value));
                    } elseif ($field === 'phone') {
                        $updateData[$field] = trim($value);
                    } else {
                        $updateData[$field] = $value;
                    }
                } else {
                    // إذا كانت القيمة فارغة ولم تكن موجودة في الشخص
                    if (empty($person->$field)) {
                        $updateData[$field] = null;
                    }
                }
            }
        }

        if (!empty($updateData)) {
            $person->update($updateData);
        }

        return $person;
    }

    /**
     * البحث عن شخص بدون إنشاء
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
}