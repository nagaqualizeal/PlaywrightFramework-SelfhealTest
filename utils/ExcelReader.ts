import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

export class ExcelReader {
    private workbook: XLSX.WorkBook;
    private sheet: XLSX.WorkSheet;
    private data: any[][];
    private headerRow: any[];

    constructor(excelPath: string, sheetName: string) {
        // Resolve path relative to project root
        const fullPath = path.resolve(excelPath);
        
        // Check if file exists
        if (!fs.existsSync(fullPath)) {
            throw new Error(`Excel file not found: ${excelPath}`);
        }

        // Read the workbook
        this.workbook = XLSX.readFile(fullPath);

        // Check if sheet exists
        if (!this.workbook.Sheets[sheetName]) {
            throw new Error(`Sheet "${sheetName}" not found in Excel file: ${excelPath}`);
        }

        // Get the specified sheet
        this.sheet = this.workbook.Sheets[sheetName];

        // Convert sheet to JSON array
        this.data = XLSX.utils.sheet_to_json(this.sheet, { header: 1 }) as any[][];

        // Check if data exists
        if (!this.data || this.data.length === 0) {
            throw new Error(`No data found in sheet "${sheetName}" of Excel file: ${excelPath}`);
        }

        // Store header row (first row)
        this.headerRow = this.data[0];
    }

    /**
     * Get cell data by row number and column name
     * @param rowNum Row number (0-based index, where 0 is header row)
     * @param columnName Column name from header row
     * @returns Cell value as string
     */
    getCellData(rowNum: number, columnName: string): string {
        // Find column index by name
        const colIndex = this.headerRow.findIndex(
            (header) => header?.toString().toLowerCase() === columnName.toLowerCase()
        );

        if (colIndex === -1) {
            throw new Error(`Column "${columnName}" not found in sheet header`);
        }

        // Check if row exists
        if (rowNum >= this.data.length) {
            throw new Error(`Row ${rowNum} does not exist. Total rows: ${this.data.length}`);
        }

        const row = this.data[rowNum];
        const cellValue = row[colIndex];

        // Handle different cell types
        if (cellValue === undefined || cellValue === null) {
            return '';
        }

        // Convert to string
        return cellValue.toString();
    }

    /**
     * Get total number of rows (including header)
     * @returns Number of rows
     */
    getRowCount(): number {
        return this.data.length;
    }

    /**
     * Get number of columns in a specific row
     * @param rowNum Row number (0-based index)
     * @returns Number of columns
     */
    getColumnCount(rowNum: number): number {
        if (rowNum >= this.data.length) {
            throw new Error(`Row ${rowNum} does not exist. Total rows: ${this.data.length}`);
        }

        return this.data[rowNum].length;
    }

    /**
     * Get all header column names
     * @returns Array of header names
     */
    getHeaders(): string[] {
        return this.headerRow.map(header => header?.toString() || '');
    }
}
