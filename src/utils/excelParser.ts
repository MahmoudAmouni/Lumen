import * as XLSX from "xlsx";

export interface ExcelCandidate {
  name: string;
  email: string;
}

export const parseExcelFile = (file: File): Promise<ExcelCandidate[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const candidates: ExcelCandidate[] = jsonData.map((row: any) => {
          const name = row.Name || row.name || row["Full Name"] || row["Full name"] || row["Candidate Name"] || "";
          const email = row.Email || row.email || row["Email Address"] || row["E-mail"] || "";
          
          return {
            name: String(name).trim(),
            email: String(email).trim(),
          };
        }).filter((candidate: ExcelCandidate) => candidate.name && candidate.email);

        if (candidates.length === 0) {
          reject(new Error("No valid candidates found in the Excel file. Please ensure the file has 'Name' and 'Email' columns."));
          return;
        }

        resolve(candidates);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : "Unknown error"}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read the file"));
    };

    reader.readAsArrayBuffer(file);
  });
};

