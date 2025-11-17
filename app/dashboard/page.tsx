'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import bgBlue from '@/public/blue-header.png';
import folderBg from '@/public/bg-card-ddashboard.png';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [chartData, setChartData] = useState<any[]>([]);
  const [dataPertahun, setDataPertahun] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    verified: 0,
    unverified: 0,
  });

  const [timeframe, setTimeframe] = useState('12 Months');

  // === DATA DUMMY PESERTA ===
  

  // === TIMEFRAME FILTER ===
  function filterByTimeframe(data: any[], timeframe: string) {
    const now = new Date();

    return data.filter((item) => {
      const date = new Date(item.tanggalDaftar);

      switch (timeframe) {
        case '12 Months':
          return date >= new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        case '6 Months':
          return date >= new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        case '30 Days':
          return date >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
        case '7 Days':
          return date >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        default:
          return true;
      }
    });
  }

  // === EFFECT UTAMA ===
  useEffect(() => {
  async function loadData() {
    setIsLoading(true);

    try {
      // Ambil semua pendaftar dari backend
      const res = await fetch("https://backend_spmb.smktibazma.sch.id/api/pendaftaran/user/full");
      const json = await res.json();

      const all = json.data || [];

      // Hitung total pendaftar
      const total = all.length;

      // Hitung verifikasi & belum verifikasi
      let verified = 0;
      let unverified = 0;

      all.forEach((item) => {
        if (item.user?.validasi_pendaftaran === "belum") {
          unverified++;
        } else {
          verified++;
        }
      });

      setSummary({ total, verified, unverified });

      // === CHART ===
      // Ambil tanggal & provinsi dari form_pribadi (bio)
      const cleaned = all
        .filter((item) => item.bio)
        .map((item) => ({
          provinsi: item.bio?.provinsi || "Tidak diketahui",
          tanggalDaftar: item.user?.tanggal_daftar,
        }));

      // Filter sesuai timeframe
      const filtered = filterByTimeframe(cleaned, timeframe);

      // Hitung chart provinsi
      const provCount: Record<string, number> = {};
      filtered.forEach((item) => {
        provCount[item.provinsi] = (provCount[item.provinsi] || 0) + 1;
      });

      const chart = Object.keys(provCount).map((prov) => ({
        name: prov,
        jumlah: provCount[prov],
      }));

      setChartData(chart);

    } catch (err) {
      console.error("Gagal fetch data:", err);
    }

    setIsLoading(false);
  }

  loadData();
}, [timeframe]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-poppins">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardLayout />

      {/* BAGIAN KONTEN */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-6 md:ml-4 transition-all duration-300">
        {/* Title */}
        <div className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-md border-b border-gray-200 mb-4 flex items-center gap-3">
          {/* Hamburger Button (mobile only) */}
          <button onClick={() => document.dispatchEvent(new CustomEvent('toggle-sidebar'))} className="md:hidden bg-[#1E3A8A] text-white p-2 rounded-md shadow">
            <Menu className="h-6 w-6" />
          </button>

          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold py-3">Dashboard</h1>
        </div>

        {/* === MOBILE HEADER (NO bgBlue) === */}
        <div className="sm:hidden mb-6">
          <h2 className="text-xl font-semibold mb-3">Statistik</h2>

          <div className="grid grid-cols-1 gap-3">
            {[
              { title: `${summary.total} Pendaftar`, subtitle: 'Jumlah Pendaftar' },
              { title: `${summary.unverified} Tidak Terverif`, subtitle: 'Tidak Terverifikasi' },
              { title: `${summary.verified} Terverifikasi`, subtitle: 'Terverifikasi' },
            ].map((card, i) => (
              <div key={i} className="w-full p-4 bg-white rounded-xl shadow border border-gray-100">
                <h3 className="text-[#132B6D] text-[18px] font-semibold">{card.title}</h3>
                <p className="text-[13px] text-black/50">{card.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* === DESKTOP HEADER WITH bgBlue === */}
        <div className="relative h-[140px] sm:h-[157px] rounded-[10px] overflow-visible mb-[110px] hidden sm:block">
          <Image src={bgBlue} alt="Background Header" fill className="object-cover w-full h-full rounded-[10px]" />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent rounded-[10px]" />

          <div className="absolute left-3 sm:left-6 -bottom-[60px] w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: `${summary.total} Pendaftar`, subtitle: 'Jumlah Pendaftar' },
                { title: `${summary.unverified} Tidak Terverif`, subtitle: 'Jumlah Tidak Terverifikasi' },
                { title: `${summary.verified} Terverifikasi`, subtitle: 'Jumlah Verifikasi' },
              ].map((card, i) => (
                <div
                  key={i}
                  className="relative w-full h-[110px] sm:h-[130px] rounded-[20px] shadow-md flex flex-col justify-center px-5 sm:px-6 bg-white"
                  style={{
                    backgroundImage: `url(${folderBg.src})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <h3 className="text-[#132B6D] text-[18px] sm:text-[22px] font-semibold truncate">{card.title}</h3>
                  <p className="text-[13px] sm:text-[15px] text-black/50 truncate">{card.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === CHART + DATA === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 shadow">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <h3 className="font-bold text-gray-800 text-base sm:text-lg">Jumlah Pendaftar Berdasarkan Provinsi</h3>

              <div className="flex flex-wrap gap-2">
                {['12 Months', '6 Months', '30 Days', '7 Days'].map((label) => (
                  <button key={label} onClick={() => setTimeframe(label)} className={`px-3 py-1 rounded-lg text-sm ${timeframe === label ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-[220px] sm:h-[280px] md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="jumlah" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Pertahun */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow">
            <h3 className="font-bold mb-4 text-gray-800 text-base sm:text-lg">Data Pertahun</h3>

            <div className="space-y-4">
              {dataPertahun.map((item) => (
                <div key={item.tahun}>
                  <div className="flex justify-between mb-1 text-sm sm:text-base">
                    <span>{item.tahun}</span>
                    <span>{item.jumlah} Peserta</span>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.jumlah}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
