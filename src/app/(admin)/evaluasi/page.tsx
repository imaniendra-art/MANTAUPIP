"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";

const fetchEvaluations = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: "1", name: "Budi Santoso", nim: "12345678", jenjang: "S1", status: "MENUNGGU", type: "KHS & LPJ" },
    { id: "2", name: "Siti Aminah", nim: "87654321", jenjang: "D3", status: "DISETUJUI", type: "KHS" },
    { id: "3", name: "Agus Pratama", nim: "11223344", jenjang: "S1", status: "REVISI", type: "LPJ" },
  ];
};

export default function EvaluasiPage() {
  const { data: evaluations, isLoading } = useQuery({
    queryKey: ["evaluations"],
    queryFn: fetchEvaluations,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Evaluasi Dokumen</h2>
          <p className="text-sm text-gray-500 mt-1">
            Review dan validasi dokumen KHS & LPJ Mahasiswa
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama atau NIM..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pipdikti-sky focus:border-transparent text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Mahasiswa</th>
                <th scope="col" className="px-6 py-4 font-medium">NIM / Jenjang</th>
                <th scope="col" className="px-6 py-4 font-medium">Tipe Dokumen</th>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading data...</td>
                </tr>
              ) : (
                evaluations?.map((item) => (
                  <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4">
                      {item.nim} <span className="text-gray-400 ml-1">({item.jenjang})</span>
                    </td>
                    <td className="px-6 py-4">{item.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                        ${item.status === 'DISETUJUI' ? 'bg-emerald-100 text-emerald-800' : 
                          item.status === 'REVISI' ? 'bg-amber-100 text-amber-800' : 
                          'bg-blue-100 text-blue-800'}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button className="p-1.5 text-gray-500 hover:text-pipdikti-sky hover:bg-sky-50 rounded-md transition-colors" title="Lihat Detail">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Setujui">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Tolak / Revisi">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
