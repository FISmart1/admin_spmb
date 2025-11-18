'use client';

import { useEffect, useState } from 'react';
import { Check, FileCheck2, FolderX, BadgeCheck, X, Download, AlertCircle, Clock4, Send, Eye, Menu } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import jsPDF from 'jspdf';


type Student = {
  id: number;
  nisn: string;
  nama: string;
  alamat: string;
  nik: string;
  kontak: string;
  verified?: boolean;
  status?: 'diterima' | 'tertolak' | 'disetujui';
  note?: string;
  birthPlace: string;
  birthDate: string;
  address: string;
  schoolOrigin: string;

  fatherName: string;
  fatherJob: string;
  motherName: string;
  motherJob: string;
  parentAddress: string;

  achievementField: string;
  achievementName: string;
  achievementLevel: string;
  majorInterest: string;

  houseType: string;
  houseStatus: string;
  waterSource: string;
  electricity: string;

  bloodType: string;
  weight: string;
  height: string;
  butawarna: string;
  penyakitMenular: string;
  penyakitNonMenular: string;
  foto: string;
  rapor: string;
  rumah_depan: string;
  ruangTamu: string;
  kamar: string;
  sktm: string;
  ss_ig: string;
  kk: string;
  kip: string;
  bpjs: string;
  rekomendasi_surat: string;
  tagihan_listrik: string;
  reels: string;
  mat3: number;
  mat4: number;
  indo3: number;
  indo4: number;
  eng3: number;
  eng4: number;
  ipa3: number;
  ipa4: number;
  pai3: number;
  pai4: number;
  rulesAgreement: boolean;
};

type FinalDecision = {
  id: number;
  nisn: string;
  nama: string;
  keputusan: 'lolos' | 'tidak';
};

export default function TableDataPage() {
  const [allDiterima, setAllDiterima] = useState<Student[]>([]);
  const [tertolak, setTertolak] = useState<Student[]>([]);
  const [disetujui, setDisetujui] = useState<Student[]>([]);
  const [dataAkhir, setDataAkhir] = useState<FinalDecision[]>(() => {
    try {
      const raw = localStorage.getItem('app_dataAkhir_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [activeFilter, setActiveFilter] = useState<'diterima' | 'tertolak' | 'disetujui'>('diterima');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showWarningDownload, setShowWarningDownload] = useState(false);
  const [showConfirmRead, setShowConfirmRead] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [showTertolakConfirm, setShowTertolakConfirm] = useState(false);
  const [showDecisionConfirm, setShowDecisionConfirm] = useState<null | { decision: 'lolos' | 'tidak' }>(null);
  const [downloadedIds, setDownloadedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const res = await fetch('https://backend_spmb.smktibazma.sch.id/api/pendaftaran/user/full');
        const data = await res.json();

        if (!Array.isArray(data.data)) {
          console.error('Format API salah:', data);
          return;
        }

        const diterimaArr: Student[] = [];
        const tertolakArr: Student[] = [];
        const disetujuiArr: Student[] = [];

        data.data.forEach((item: any) => {
          const status = item.user.validasi_pendaftaran;
          const bio = item.bio;

          const row: Student = {
            id: item.user.id,
            nisn: bio?.nisn || '-',
            nama: bio?.fullName || item.user.name,
            alamat: bio?.addressDetail || '-',
            nik: bio?.nik || '-',
            kontak: bio?.phone || '-',
            status: 'diterima',
          };

          if (status === 'pending') {
            row.status = 'tertolak';
            tertolakArr.push(row);
          } else if (status === 'sudah') {
            row.status = 'disetujui';
            disetujuiArr.push(row);
          } else if (status === 'belum') {
            row.status = 'diterima';
            diterimaArr.push(row);
          } else {
            row.status = 'diterima';
            diterimaArr.push(row);
          }
        });

        setAllDiterima(diterimaArr);
        setTertolak(tertolakArr);
        setDisetujui(disetujuiArr);
      } catch (err) {
        console.error('Gagal fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // ... (useEffect untuk localStorage tetap sama)

  const handleDownloadPDF = (student: Student | null) => {
    if (!student) return;
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Data Siswa', 20, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    const data = [`NISN: ${student.nisn}`, `Nama: ${student.nama}`, `Alamat: ${student.alamat}`, `NIK: ${student.nik}`, `Kontak: ${student.kontak}`];

    let y = 40;
    data.forEach((line) => {
      doc.text(line, 20, y);
      y += 10;
    });

    doc.save(`data_${student.nama.replace(/\s+/g, '_')}.pdf`);
    setDownloadedIds((prev) => (prev.includes(student.id) ? prev : [...prev, student.id]));
  };

  const diterimaList = allDiterima.filter((s) => [undefined, 'diterima'].includes(s.status));

  const filteredViewList =
    activeFilter === 'diterima'
      ? diterimaList.filter((s) => s.nama.toLowerCase().includes(searchQuery.toLowerCase()) || s.nisn.toLowerCase().includes(searchQuery.toLowerCase()))
      : activeFilter === 'tertolak'
      ? tertolak.filter((s) => s.nama.toLowerCase().includes(searchQuery.toLowerCase()) || s.nisn.toLowerCase().includes(searchQuery.toLowerCase()))
      : disetujui.filter((s) => s.nama.toLowerCase().includes(searchQuery.toLowerCase()) || s.nisn.toLowerCase().includes(searchQuery.toLowerCase()));

  // ---------------- Setujui flow ----------------
  const handleSetujuiClicked = (student: Student) => {
    setSelectedStudent(student);
    if (!downloadedIds.includes(student.id)) {
      setShowWarningDownload(true);
      return;
    }
    setShowConfirmRead(true);
  };

  const confirmSetujui = async () => {
    if (!selectedStudent) return;

    try {
      // Update validasi_pendaftaran menjadi "sudah"
      const res = await fetch('https://backend_spmb.smktibazma.sch.id/api/pendaftaran/validasi', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedStudent.id,
          validasi_pendaftaran: 'sudah',
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('Gagal update:', result);
        alert('Gagal menyetujui data!');
        return;
      }

      // Update state frontend
      setDisetujui((prev) => [...prev, { ...selectedStudent, status: 'disetujui' }]);
      setAllDiterima((prev) => prev.filter((s) => s.id !== selectedStudent.id));

      setShowConfirmRead(false);
      setSelectedStudent(null);
      setActiveFilter('disetujui');

      alert('Data berhasil disetujui!');
    } catch (error) {
      console.error('Error confirmSetujui:', error);
      alert('Terjadi kesalahan server.');
    }
  };

  // ---------------- Tolak flow ----------------
  const handleTolakClicked = (student: Student) => {
    setSelectedStudent(student);
    setNoteInput(student.note ?? '');
    setShowNoteModal(true);
  };

  const sendTolakWithNote = async () => {
    if (!selectedStudent) return;

    const noteTrim = noteInput.trim();
    if (!noteTrim) {
      alert('Harap isi alasan penolakan!');
      return;
    }

    try {
      // Update validasi_pendaftaran menjadi "pending"
      const updateRes = await fetch('https://backend_spmb.smktibazma.sch.id/api/pendaftaran/validasi', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedStudent.id,
          validasi_pendaftaran: 'pending',
        }),
      });

      if (!updateRes.ok) {
        const result = await updateRes.json();
        console.error('Gagal update status:', result);
        alert('Gagal mengupdate status data!');
        return;
      }

      // Kirim notifikasi - PERBAIKAN: pastikan users_id dikirim sebagai number
      try {
        const notifRes = await fetch('https://backend_spmb.smktibazma.sch.id/notifikasi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: Number(selectedStudent.id), // Pastikan sebagai number
            title: 'Pendaftaran Ditolak',
            message: noteTrim,
          }),
        });

        if (notifRes.ok) {
          const notifResult = await notifRes.json();
          console.log('Notifikasi berhasil dikirim:', notifResult);
        } else {
          const errorResult = await notifRes.json();
          console.error('Gagal kirim notifikasi:', errorResult);
        }
      } catch (e) {
        console.error('Gagal kirim notifikasi:', e);
      }

      // Update state frontend
      setTertolak((prev) => [...prev, { ...selectedStudent, status: 'tertolak', note: noteTrim }]);
      setAllDiterima((prev) => prev.filter((s) => s.id !== selectedStudent.id));

      setShowNoteModal(false);
      setShowTertolakConfirm(true);
      setSelectedStudent(null);
      setNoteInput('');
      setActiveFilter('tertolak');
    } catch (error) {
      console.error('Error sendTolakWithNote:', error);
      alert('Terjadi kesalahan server.');
    }
  };

  const confirmSendNotifTolak = () => {
    setShowTertolakConfirm(false);
  };

  // edit note on tertolak
  const handleEditNoteTertolak = (student: Student) => {
    setSelectedStudent(student);
    setNoteInput(student.note ?? '');
    setShowNoteModal(true);
  };

  const saveEditedNoteTertolak = async () => {
    if (!selectedStudent) return;
    const noteTrim = noteInput.trim();

    if (!noteTrim) {
      alert('Harap isi catatan!');
      return;
    }

    try {
      // Kirim notifikasi dengan catatan yang diperbarui - PERBAIKAN: pastikan users_id dikirim sebagai number
      const notifRes = await fetch('https://backend_spmb.smktibazma.sch.id/notifikasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: Number(selectedStudent.id), // Pastikan sebagai number
          title: 'Pembaruan Status Pendaftaran',
          message: noteTrim,
        }),
      });

      if (notifRes.ok) {
        const notifResult = await notifRes.json();
        console.log('Notifikasi berhasil dikirim:', notifResult);
      } else {
        const errorResult = await notifRes.json();
        console.error('Gagal kirim notifikasi:', errorResult);
      }
    } catch (e) {
      console.error('Gagal kirim notifikasi:', e);
    }

    setTertolak((prev) => prev.map((s) => (s.id === selectedStudent.id ? { ...s, note: noteTrim } : s)));
    setShowNoteModal(false);
    setSelectedStudent(null);
    setNoteInput('');

    alert('Catatan berhasil diperbarui!');
  };

  // ---------------- Disetujui -> Final Decision ----------------
  const handleDecisionOnDisetujui = (student: Student, decision: 'lolos' | 'tidak') => {
    setSelectedStudent(student);
    setShowDecisionConfirm({ decision });
  };

  const confirmDecision = () => {
    if (!selectedStudent || !showDecisionConfirm) return;

    const keputusan = showDecisionConfirm.decision;

    setDisetujui((prev) => prev.filter((s) => s.id !== selectedStudent.id));
    setAllDiterima((prev) => prev.filter((s) => s.id !== selectedStudent.id));
    setTertolak((prev) => prev.filter((s) => s.id !== selectedStudent.id));

    const final: FinalDecision = {
      id: selectedStudent.id,
      nisn: selectedStudent.nisn,
      nama: selectedStudent.nama,
      keputusan,
    };

    try {
      const raw = localStorage.getItem('app_dataAkhir_v1');
      const existing: FinalDecision[] = raw ? JSON.parse(raw) : [];
      const updated = [...existing.filter((d) => d.id !== final.id), final];
      localStorage.setItem('app_dataAkhir_v1', JSON.stringify(updated));
      setDataAkhir(updated);

      alert(`Siswa ${selectedStudent.nama} berhasil ditetapkan sebagai ${keputusan === 'lolos' ? 'LOLOS' : 'TIDAK LOLOS'}!`);
    } catch (e) {
      console.error('Gagal menyimpan keputusan akhir:', e);
      alert('Gagal menyimpan keputusan akhir!');
    }

    setShowDecisionConfirm(null);
    setSelectedStudent(null);
  };

  // ... (getCardStyle, CircleDecoration, counts, dan render UI tetap sama)
  const getCardStyle = (type: 'diterima' | 'tertolak' | 'disetujui') => {
    const isActive = activeFilter === type;
    const colors = {
      diterima: '#25A215',
      tertolak: '#08979C',
      disetujui: '#D97400',
    } as Record<string, string>;

    return {
      background: isActive ? '#208FEA' : '#FFFFFF',
      color: isActive ? '#FFFFFF' : '#000000',
      borderLeft: `7px solid ${colors[type]}`,
      boxShadow: '2px 2px 4px rgba(0,0,0,0.25)',
    } as React.CSSProperties;
  };

  const CircleDecoration = ({ active }: { active: boolean }) => (
    <div className="absolute top-0 right-0 w-[140px] h-[140px] translate-x-1/2 -translate-y-1/3">
      <div className={`absolute w-[111px] h-[111px] rounded-full ${active ? 'bg-white/20' : 'bg-[#E3E2E2]'}`}></div>
      <div className={`absolute left-[27px] top-[27px] w-[57px] h-[57px] rounded-full ${active ? 'bg-white/30' : 'bg-[#EEEEEE]'}`}></div>
    </div>
  );

  const counts = {
    diterima: allDiterima.length,
    tertolak: tertolak.length,
    disetujui: disetujui.length,
  };

 

  const exportAllData = async () => {
  // Dynamic import biar tidak dibaca SSR
  const XLSX = await import("xlsx");
  const { default: saveAs } = await import("file-saver");

  const combined = [
    ...allDiterima.map((s) => ({ ...s, kategori: "Diterima" })),
    ...tertolak.map((s) => ({ ...s, kategori: "Tertolak" })),
    ...disetujui.map((s) => ({ ...s, kategori: "Disetujui" })),
  ];

  const dataToExport = combined.map((s) => ({
    NISN: s.nisn,
    Nama: s.nama,
    Alamat: s.alamat,
    NIK: s.nik,
    Kontak: s.kontak,
    Kategori: s.kategori,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const fileData = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(fileData, "data_semua_siswa.xlsx");
};



  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardLayout />

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-6 md:ml-4 transition-all duration-300">
        {/* Title */}
        <div className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-md border-b border-gray-200 mb-4 flex items-center gap-3">
          <button onClick={() => document.dispatchEvent(new CustomEvent('toggle-sidebar'))} className="md:hidden bg-[#1E3A8A] text-white p-2 rounded-md shadow">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold py-3">Dashboard / Table Data</h1>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 justify-items-center">
          {[
            { type: 'diterima', title: 'Data Diterima', icon: FileCheck2, count: counts.diterima },
            { type: 'tertolak', title: 'Data Tertolak', icon: FolderX, count: counts.tertolak },
            { type: 'disetujui', title: 'Data Disetujui', icon: BadgeCheck, count: counts.disetujui },
          ].map(({ type, title, icon: Icon, count }) => (
            <button key={type} onClick={() => setActiveFilter(type as any)} className="relative w-full sm:w-[360px] md:w-[380px] h-[150px] rounded-[10px] text-left transition overflow-hidden" style={getCardStyle(type as any)}>
              <div className="absolute left-6 top-5 flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-[10px] flex items-center justify-center"
                  style={{
                    backgroundColor: String(getCardStyle(type as any).borderLeft || '').split(' ')[2] || '#208FEA',
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg sm:text-xl font-semibold ${activeFilter === type ? 'text-white' : 'text-[#132B6D]'}`}>{title}</h3>
                  <p className={`text-base ${activeFilter === type ? 'text-white' : 'text-black'}`}>{count} data</p>
                </div>
              </div>
              <CircleDecoration active={activeFilter === type} />
              <span className={`absolute left-6 bottom-3 text-sm font-semibold ${activeFilter === type ? 'text-white' : 'text-gray-800'}`}>Selengkapnya →</span>
            </button>
          ))}
        </div>

        {/* Search / header */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center bg-white shadow-md rounded-[10px] p-5 mb-6 gap-4 font-[Poppins]">
          <div className="flex flex-col items-start w-full sm:w-auto">
            <span className="text-[20px] font-medium text-[#292929]">Data Siswa</span>
            <span className="text-sm text-gray-500 mt-1">{activeFilter === 'diterima' ? 'Menampilkan data diterima' : activeFilter === 'tertolak' ? 'Menampilkan data tertolak' : 'Menampilkan data disetujui'}</span>
          </div>

          <div className="flex flex-row justify-end items-center gap-5 w-full sm:w-auto">
            <div className="flex items-center bg-[#EAEAEA] rounded-[10px] px-3 py-2 w-full sm:w-[276px]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M9.5 17a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
              </svg>
              <input type="text" placeholder="Cari siswa..." className="bg-transparent outline-none w-full text-[13px] text-gray-700 placeholder:text-gray-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <button onClick={exportAllData} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
              Export Semua Data
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Memuat data...</span>
          </div>
        )}

        {/* Table */}
        {!isLoading && (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full border-collapse text-sm sm:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 sm:px-4 py-2 text-left">NISN</th>
                  <th className="px-3 sm:px-4 py-2 text-left">Nama</th>
                  <th className="px-3 sm:px-4 py-2 text-left">Alamat</th>
                  <th className="px-3 sm:px-4 py-2 text-left">NIK</th>
                  <th className="px-3 sm:px-4 py-2 text-left">Kontak</th>
                  <th className="px-3 sm:px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredViewList.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50 text-xs sm:text-sm">
                    <td className="px-3 sm:px-4 py-2 font-mono text-green-600">{s.nisn}</td>
                    <td className="px-3 sm:px-4 py-2">{s.nama}</td>
                    <td className="px-3 sm:px-4 py-2 truncate max-w-[120px] sm:max-w-xs">{s.alamat}</td>
                    <td className="px-3 sm:px-4 py-2">{s.nik}</td>
                    <td className="px-3 sm:px-4 py-2">{s.kontak}</td>

                    <td className="px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-3 justify-center flex-wrap">
                      {activeFilter === 'diterima' && (
                        <>
                          <button onClick={() => handleSetujuiClicked(s)} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-500 text-white text-xs sm:text-sm rounded-lg hover:bg-green-600 transition">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4" /> Setujui
                          </button>

                          <button onClick={() => handleTolakClicked(s)} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-yellow-500 text-white text-xs sm:text-sm rounded-lg hover:bg-yellow-600 transition">
                            <Clock4 className="w-3 h-3 sm:w-4 sm:h-4" /> Tolak
                          </button>

                          <button
                            onClick={() => {
                              setSelectedStudent(s);
                              handleDownloadPDF(s);
                            }}
                            className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-700 text-xs sm:text-sm rounded-lg hover:bg-yellow-200 transition"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              sessionStorage.setItem('ppdb_diterima', JSON.stringify(filteredViewList));
                              window.location.href = `/table-data/${s.id}`;
                            }}
                            className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {activeFilter === 'tertolak' && (
                        <>
                          <button onClick={() => handleEditNoteTertolak(s)} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-lg hover:bg-gray-200 transition">
                            Edit Note
                          </button>

                          <button
                            onClick={() => {
                              setSelectedStudent(s);
                              setShowTertolakConfirm(true);
                            }}
                            className={`flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-500 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-600 transition ${!s.note ? 'opacity-60 cursor-not-allowed' : ''}`}
                            disabled={!s.note}
                          >
                            <Send className="w-4 h-4" /> Kirim Ulang Notifikasi
                          </button>
                          <button onClick={() => handleSetujuiClicked(s)} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-500 text-white text-xs sm:text-sm rounded-lg hover:bg-green-600 transition">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4" /> Setujui
                          </button>
                          <button
                            onClick={() => {
                              sessionStorage.setItem('ppdb_diterima', JSON.stringify(filteredViewList));
                              window.location.href = `/table-data/${s.id}`;
                            }}
                            className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {activeFilter === 'disetujui' && (
                        <>
                          <button onClick={() => handleDecisionOnDisetujui(s, 'lolos')} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-500 text-white text-xs sm:text-sm rounded-lg hover:bg-green-600 transition">
                            Loloskan
                          </button>
                          <button onClick={() => handleDecisionOnDisetujui(s, 'tidak')} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-red-500 text-white text-xs sm:text-sm rounded-lg hover:bg-red-600 transition">
                            Tidak Loloskan
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredViewList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal components tetap sama seperti sebelumnya */}
        {showWarningDownload && selectedStudent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative">
              <button onClick={() => setShowWarningDownload(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
              <div className="flex flex-col items-center text-center">
                <AlertCircle className="w-10 h-10 text-yellow-500 mb-3" />
                <h2 className="text-lg font-semibold text-[#132B6D] mb-2">Anda belum mendownload data!</h2>
                <p className="text-gray-600 text-sm mb-4">Silakan download dan baca terlebih dahulu file PDF data siswa sebelum melakukan verifikasi.</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setShowWarningDownload(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition">
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      handleDownloadPDF(selectedStudent);
                      setShowWarningDownload(false);
                      setShowConfirmRead(true);
                    }}
                    className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    <Download className="w-4 h-4" /> Download Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showConfirmRead && selectedStudent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative text-center">
              <button onClick={() => setShowConfirmRead(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-[#132B6D] mb-4">Sudahkah Anda membaca data siswa ini?</h2>
              <p className="text-gray-600 text-sm mb-6">Pastikan Anda telah meninjau seluruh informasi pada file PDF sebelum menyetujui.</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setShowConfirmRead(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition">
                  Batal
                </button>
                <button onClick={confirmSetujui} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                  Ya, Sudah Baca
                </button>
              </div>
            </div>
          </div>
        )}

        {showNoteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative">
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setSelectedStudent(null);
                  setNoteInput('');
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-[#132B6D] mb-4">{selectedStudent && tertolak.some((t) => t.id === selectedStudent.id) ? 'Edit Catatan Penolakan' : 'Tolak Data Siswa'}</h2>
              <p className="text-gray-600 text-sm mb-3">{selectedStudent && tertolak.some((t) => t.id === selectedStudent.id) ? 'Edit alasan atau catatan penolakan:' : 'Tulis alasan atau catatan kenapa data ini ditolak:'}</p>
              <textarea value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Tuliskan catatan di sini..." className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-4" rows={4} />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowNoteModal(false);
                    setSelectedStudent(null);
                    setNoteInput('');
                  }}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Batal
                </button>
                {selectedStudent && tertolak.some((t) => t.id === selectedStudent.id) ? (
                  <button
                    onClick={saveEditedNoteTertolak}
                    disabled={!noteInput.trim()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${noteInput.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                  >
                    Simpan Note
                  </button>
                ) : (
                  <button
                    onClick={sendTolakWithNote}
                    disabled={!noteInput.trim()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${noteInput.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                  >
                    <Send className="w-4 h-4" /> Tolak & Kirim Notifikasi
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {showTertolakConfirm && selectedStudent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative text-center">
              <button
                onClick={() => {
                  setShowTertolakConfirm(false);
                  setSelectedStudent(null);
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-[#132B6D] mb-4">Notifikasi Terkirim</h2>
              <p className="text-gray-600 text-sm mb-6">
                Notifikasi telah dikirim ke <span className="font-semibold text-gray-800">{selectedStudent?.nama}</span> mengenai alasan penolakan.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setShowTertolakConfirm(false);
                    setSelectedStudent(null);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {showDecisionConfirm && selectedStudent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative text-center">
              <button onClick={() => setShowDecisionConfirm(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-[#132B6D] mb-4">{showDecisionConfirm.decision === 'lolos' ? 'Konfirmasi Loloskan' : 'Konfirmasi Tidak Loloskan'}</h2>
              <p className="text-gray-600 text-sm mb-6">
                Apakah Anda yakin ingin menetapkan status <span className="font-semibold">{showDecisionConfirm.decision === 'lolos' ? 'LOLOS' : 'TIDAK LOLOS'}</span> untuk <span className="font-semibold">{selectedStudent.nama}</span>?
              </p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setShowDecisionConfirm(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition">
                  Batal
                </button>
                <button onClick={confirmDecision} className={`px-4 py-2 rounded-lg text-white ${showDecisionConfirm.decision === 'lolos' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>
                  {showDecisionConfirm.decision === 'lolos' ? 'Loloskan' : 'Tidak Loloskan'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
