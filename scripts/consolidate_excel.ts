import * as XLSX from 'xlsx';
import * as path from 'path';

function consolidateExcel() {
  const inputFile = path.join(process.cwd(), 'public', 'KIP 2025 GENAP.xlsx');
  const outputFile = path.join(process.cwd(), 'public', 'KIP_Konsolidasi.xlsx');

  console.log(`Membaca file dari: ${inputFile}`);
  
  try {
    const workbook = XLSX.readFile(inputFile);
    let allData: any[] = [];

    // Loop through each sheet
    workbook.SheetNames.forEach((sheetName) => {
      console.log(`Memproses sheet: ${sheetName}`);
      
      const worksheet = workbook.Sheets[sheetName];
      // Convert sheet to JSON array (assuming the first row contains headers)
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      // Inject 'Angkatan' column based on sheet name
      const dataWithAngkatan = data.map((row: any) => ({
        ...row,
        Angkatan: sheetName
      }));

      allData = allData.concat(dataWithAngkatan);
    });

    console.log(`Total baris tergabung: ${allData.length}`);

    // Create a new workbook and add the consolidated data
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(allData);
    
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Konsolidasi');

    // Write to the output file
    XLSX.writeFile(newWorkbook, outputFile);
    
    console.log(`Sukses! File konsolidasi disimpan di: ${outputFile}`);
  } catch (error) {
    console.error('Terjadi kesalahan saat memproses Excel:', error);
  }
}

consolidateExcel();
