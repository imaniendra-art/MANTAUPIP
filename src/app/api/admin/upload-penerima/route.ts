import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { User } from "@/models/User";
import { connectDB } from "@/lib/mongoose";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Using defval: "" to make sure all headers exist even if empty
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" }) as any[];

    if (rawData.length === 0) {
      return NextResponse.json({ error: "Excel file is empty" }, { status: 400 });
    }

    await connectDB();

    let successCount = 0;
    let errorCount = 0;

    const findValue = (row: any, keyMatch: string) => {
      const keys = Object.keys(row);
      const matchedKey = keys.find(k => k.trim().toLowerCase().includes(keyMatch.toLowerCase()));
      return matchedKey ? row[matchedKey] : "";
    };

    const parseNumber = (val: any) => {
      if (typeof val === 'number') return val;
      if (!val) return 0;
      const cleaned = String(val).replace(/[^0-9.-]+/g, "");
      return Number(cleaned) || 0;
    };

    for (const row of rawData) {
      // Map Excel headers to model properties robustly
      const nim = String(findValue(row, "NIM")).trim();
      const nama = String(findValue(row, "Nama")).trim();
      const program_studi = String(findValue(row, "Program Studi")).trim();
      const angkatan = String(findValue(row, "Angkatan")).trim();
      const jenjang = String(findValue(row, "Jenjang")).trim();
      const bp = parseNumber(findValue(row, "BP"));
      const bh = parseNumber(findValue(row, "BH"));
      
      let status_pip = String(findValue(row, "Status PIP")).toUpperCase().trim();
      if (!["AKTIF", "DICABUT", "LULUS"].includes(status_pip)) {
        status_pip = "AKTIF";
      }

      if (!nama) {
        errorCount++;
        continue;
      }

      try {
        const userData = {
          role: "MAHASISWA",
          nama_lengkap: nama,
          nim: nim,
          jenjang: jenjang,
          program_studi: program_studi,
          angkatan: angkatan,
          status_pip: status_pip,
          bp: bp,
          bh: bh
        };

        if (nim) {
          await User.findOneAndUpdate({ nim }, userData, { upsert: true, new: true });
        } else {
          await User.create(userData);
        }
        successCount++;
      } catch (err) {
        console.error("Error saving user:", err);
        errorCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Berhasil mengunggah ${successCount} data. Gagal: ${errorCount}.` 
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to process upload" }, { status: 500 });
  }
}
