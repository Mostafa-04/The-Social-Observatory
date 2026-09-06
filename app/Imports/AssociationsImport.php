<?php

namespace App\Imports;

use App\Models\Association;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Validators\Failure;
use Illuminate\Support\Facades\Log;


class AssociationsImport implements
    ToModel,
    WithHeadingRow,
    SkipsOnError
{
    use SkipsErrors;

    protected $rowCount = 0;
    protected $successCount = 0;
    protected $failedRows = [];

    public function __construct(
        protected $countryId,
        protected $type
    ) {}


    public function headingRow(): int
    {
        return 2;
    }


    public function model(array $row)
    {
        $this->rowCount++;

        try {

            $name = $this->getColumnValue($row, ['nom', 'name', 'اسم']);
            $description = $this->getColumnValue($row, ['description', 'وصف']);
            $website = $this->getColumnValue($row, ['site_web', 'website', 'الموقع']);
            $email = $this->getColumnValue($row, ['email', 'البريد']);
            $phone = $this->getColumnValue($row, ['telephone', 'phone', 'الهاتف']);
            $city = $this->getColumnValue($row, ['ville', 'city', 'المدينة']);
            $address = $this->getColumnValue($row, ['adresse', 'address', 'العنوان']);
            $foundingYear = $this->getColumnValue($row, ['annee_fondation', 'founding_year', 'سنة_التأسيس']);
            $beneficiaries = $this->getColumnValue($row, ['beneficiaires', 'beneficiaries', 'المستفيدون']);

            
            if (empty($name) || !is_string($name)) {
                $this->failedRows[] = [
                    'row' => $this->rowCount,
                    'error' => 'Le nom est manquant ou vide'
                ];
                return null;
            }

          
            $name = trim($name);

       
            $foundingYear = $this->extractYear($foundingYear);

            
            $beneficiaries = !empty($beneficiaries) && is_numeric($beneficiaries)
                ? (int) $beneficiaries
                : null;

         
            $website = !empty($website) ? trim($website) : null;
            if ($website && !filter_var($website, FILTER_VALIDATE_URL)) {
               
                if (!str_starts_with($website, 'http://') && !str_starts_with($website, 'https://')) {
                    $website = 'https://' . $website;
                }
            }

            
            $association = new Association([
                'name' => $name,
                'description' => !empty($description) ? trim($description) : null,
                'type' => $this->type,
                'website' => $website,
                'email' => !empty($email) ? trim($email) : null,
                'phone' => !empty($phone) ? trim($phone) : null,
                'country_id' => $this->countryId,
                'city' => !empty($city) ? trim($city) : null,
                'address' => !empty($address) ? trim($address) : null,
                'founding_year' => $foundingYear,
                'beneficiaries_count' => $beneficiaries,
                'data_source' => 'import_excel',
                'status' => 'active',
            ]);

            $this->successCount++;
            return $association;

        } catch (\Exception $e) {
            $this->failedRows[] = [
                'row' => $this->rowCount,
                'error' => $e->getMessage()
            ];

            Log::error('Association Import Row Error: ' . $e->getMessage(), [
                'row_number' => $this->rowCount,
                'row_data' => $row,
            ]);

            return null;
        }
    }

    /**
     * استخراج السنة من قيمة قد تكون رقماً (1918) أو تاريخاً كاملاً (16/03/1918)
     */
    protected function extractYear($value): ?int
    {
        if (empty($value)) {
            return null;
        }

        if (is_numeric($value)) {
            return (int) $value;
        }

        if (is_string($value) && preg_match('/(\d{4})/', $value, $matches)) {
            return (int) $matches[1];
        }

        return null;
    }

    /**
     * الحصول على قيمة العمود من خلال عدة أسماء محتملة
     */
    protected function getColumnValue(array $row, array $possibleNames)
    {
        foreach ($possibleNames as $name) {
            // تنظيف اسم العمود
            $cleanName = strtolower(trim($name));

            foreach ($row as $key => $value) {
                if (strtolower(trim($key)) === $cleanName) {
                    return $value;
                }
            }
        }

        return null;
    }

    /**
     * معالجة الأخطاء
     */
    public function onError(\Throwable $e)
    {
        Log::error('Association Import Error: ' . $e->getMessage());
    }

    /**
     * الحصول على عدد الصفوف الناجحة
     */
    public function getSuccessCount()
    {
        return $this->successCount;
    }

    /**
     * الحصول على الصفوف الفاشلة
     */
    public function getFailedRows()
    {
        return $this->failedRows;
    }
}