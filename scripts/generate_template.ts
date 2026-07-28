import * as XLSX from 'xlsx';
import * as path from 'path';

function generateTemplate() {
  const outputFile = path.join(process.cwd(), 'public', 'Template_Data_Penerima.xlsx');

  // Headers only
  const data = [
    {
      "NIM": "",
      "Nama Lengkap": "",
      "Program Studi": "",
      "Angkatan": "",
      "Jenjang": "",
      "Status PIP": "",
      "BP": "",
      "BH": ""
    }
  ];

  const newWorkbook = XLSX.utils.book_new();
  const newWorksheet = XLSX.utils.json_to_sheet(data, { header: ["NIM", "Nama Lengkap", "Program Studi", "Jenjang", "Status PIP", "Angkatan", "BP", "BH"] });
  
  // Clear the dummy row so only headers remain
  XLSX.utils.sheet_add_aoa(newWorksheet, [[]], { origin: "A2" });

  XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Template');

  XLSX.writeFile(newWorkbook, outputFile);
  console.log(`Berhasil membuat template di: ${outputFile}`);
}

generateTemplate();
