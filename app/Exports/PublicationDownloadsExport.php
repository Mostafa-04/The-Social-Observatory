<?php
// app/Exports/PublicationDownloadsExport.php

namespace App\Exports;

use App\Models\Publication;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class PublicationDownloadsExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths
{
    protected Publication $publication;

    public function __construct(Publication $publication)
    {
        $this->publication = $publication;
    }

    public function collection()
    {
        return $this->publication->downloads()
            ->latest()
            ->get(['name', 'email']);
    }

    public function headings(): array
    {
        return [
            'Name',
            'Email',
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 30,
            'B' => 35,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // تنسيق صف العناوين: خلفية برتقالية + كتابة بيضاء وسميكة
        $sheet->getStyle('A1:B1')->applyFromArray([
            'font' => [
                'bold'  => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size'  => 12,
            ],
            'fill' => [
                'fillType'   => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'BF5429'], // اللون البرتقالي المستخدم في موقعكم
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical'   => Alignment::VERTICAL_CENTER,
            ],
        ]);

        // ارتفاع صف العناوين
        $sheet->getRowDimension(1)->setRowHeight(22);

        return [];
    }
}