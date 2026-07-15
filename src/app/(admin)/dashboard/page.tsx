"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, FileText, CheckCircle, AlertCircle } from "lucide-react";

// Placeholder fetch function
const fetchStats = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    totalStudents: 1250,
    documentsSubmitted: 840,
    approved: 720,
    needsRevision: 120,
  };
};

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: fetchStats,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Ringkasan data penerima PIP Kuliah
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Penerima"
          value={isLoading ? "..." : data?.totalStudents.toString()}
          icon={<Users className="h-6 w-6 text-pipdikti-navy" />}
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Dokumen Masuk"
          value={isLoading ? "..." : data?.documentsSubmitted.toString()}
          icon={<FileText className="h-6 w-6 text-pipdikti-sky" />}
          bgColor="bg-sky-50"
        />
        <StatCard
          title="Disetujui"
          value={isLoading ? "..." : data?.approved.toString()}
          icon={<CheckCircle className="h-6 w-6 text-emerald-600" />}
          bgColor="bg-emerald-50"
        />
        <StatCard
          title="Perlu Revisi"
          value={isLoading ? "..." : data?.needsRevision.toString()}
          icon={<AlertCircle className="h-6 w-6 text-pipdikti-gold" />}
          bgColor="bg-amber-50"
        />
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow border border-white/40 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
        <div className="text-sm text-gray-500 py-8 text-center border-2 border-dashed border-gray-100 rounded-lg">
          Belum ada aktivitas terbaru.
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bgColor }: { title: string; value?: string; icon: React.ReactNode; bgColor: string }) {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-xl shadow border border-white/40 p-6 flex items-center gap-4">
      <div className={`p-4 rounded-full ${bgColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value || "0"}</p>
      </div>
    </div>
  );
}
