'use client';

import { useEffect, useState } from 'react';
import { Check, FileCheck2, FolderX, BadgeCheck, X, Download, AlertCircle, Clock4, Send, Eye, Menu } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import jsPDF from 'jspdf';

type Student = {
  id: number;
  verified?: boolean;
  status?: 'diterima' | 'tertolak' | 'disetujui';
  note?: string;
  waktu_daftar: string;

  // --- DATA DASAR / IDENTITAS ---
  fullName: string;
  nama: string; // tetap dipertahankan
  email: string;
  nisn: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  parentStatus: string;
  familyStatus: string;
  socialAid: string;
  livingWith: string;
  livingWithCustom: string;
  kontak: string;
  socialMedia: string;
  alamat: string;
  schoolOrigin: string;
  graduationYear: string;
  npsn: string;
  province: string;
  city: string;
  district: string;
  sub_district: string;
  rt: string;
  rw: string;
  postalCode: string;
  childOrder: string;

  fatherName: string;
  fatherJob: string;
  ayah_alamat: string;
  ayah_tanggungan: string;
  ayah_penghasilan: string;
  motherName: string;
  motherJob: string;
  ibu_tanggungan: string;
  ibu_penghasilan: string;
  phone: string;
  phone2: string;
  ibu_alamat: string;
  waliNama: string;
  wali_alamat: string;
  wali_pekerjaan: string;
  wali_tanggungan: string;
  wali_penghasilan: string;
  wali_hubungan: string;
  wali_sumber: string;
  info_ppdb: string;
  saudara_beasiswa: string;

  achievementField: string;
  achievementName: string;
  achievementLevel: string;
  majorInterest: string;
  foreignLanguage: string;
  specialNeeds: string;

  houseType: string;
  luasTanah: string;
  houseStatus: string;
  waterSource: string;
  electricity: string;
  kendaraanDimiliki: string;
  statusKendaraan: string;
  hartaTidakBergerak: string;
  statusHarta: string;

  bloodType: string;
  weight: string;
  height: string;
  butawarna: string;
  penyakitMenular: string;
  penyakitNonMenular: string;
  kesehatanMental: string;
  perokok: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
          const orangtua = item.orangtua;
          const pres = item.pres;
          const rumah = item.rumah;
          const berkas = item.berkas;
          const kesehatan = item.kesehatan;
          const aturan = item.aturan;

          const row: Student = {
            id: item.user.id,
            waktu_daftar: item.user.created_at
              ? new Date(item.user.created_at).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })
              : '-',
            nisn: bio?.nisn || '-',
            nama: bio?.fullName || item.user.name,
            alamat: bio?.addressDetail || '-',
            nik: bio?.nik || '-',
            kontak: bio?.phone || '-',

            birthPlace: bio?.birthPlace,
            birthDate: bio?.birthDate
              ? new Date(bio.birthDate).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })
              : '-',
            parentStatus: bio?.parentStatus,
            familyStatus: bio?.familyStatus,
            socialAid: bio?.socialAid,
            livingWith: bio?.livingWith,
            livingWithCustom: bio?.livingWithCustom,
            socialMedia: bio?.socialMedia,
            schoolOrigin: bio?.schoolOrigin,
            graduationYear: bio?.graduationYear,
            npsn: bio?.npsn,
            province: bio?.province,
            city: bio?.city,
            district: bio?.district,
            sub_district: bio?.village,
            rt: bio?.rt,
            rw: bio?.rw,
            postalCode: bio?.postalCode,
            childOrder: bio?.childOrder,

            fatherName: orangtua?.ayah_nama,
            ayah_alamat: orangtua?.ayah_alamat,
            fatherJob: orangtua?.ayah_pekerjaan,
            ayah_tanggungan: orangtua?.ayah_tanggungan,
            ayah_penghasilan: orangtua?.ayah_penghasilan,
            motherName: orangtua?.ibu_nama,
            motherJob: orangtua?.ibu_pekerjaan,
            ibu_tanggungan: orangtua?.ibu_tanggungan,
            ibu_penghasilan: orangtua?.ibu_penghasilan,
            phone: orangtua?.ayah_telepon,
            phone2: orangtua?.ibu_telepon,
            waliNama: orangtua?.wali_nama,
            wali_alamat: orangtua?.wali_alamat,
            wali_pekerjaan: orangtua?.wali_pekerjaan,
            wali_tanggungan: orangtua?.wali_tanggungan,
            wali_penghasilan: orangtua?.wali_penghasilan,
            ibu_alamat: orangtua?.ibu_alamat,
            wali_hubungan: orangtua?.wali_hubungan,
            wali_sumber: orangtua?.wali_sumber,
            info_ppdb: orangtua?.info_ppdb,
            saudara_beasiswa: orangtua?.saudara_beasiswa,

            achievementField: pres?.achievement,
            achievementName: pres?.hafalan,
            achievementLevel: pres?.organization,
            majorInterest: pres?.hobby,
            foreignLanguage: pres?.foreign_language,
            specialNeeds: pres?.special,

            houseType: rumah?.kualitasRumah,
            luasTanah: rumah?.luasTanah,
            houseStatus: rumah?.statusKepemilikanRumah,
            waterSource: rumah?.sumberAir,
            electricity: rumah?.dayaListrik,
            kendaraanDimiliki: rumah?.kendaraanDimiliki,
            statusKendaraan: rumah?.statusKendaraan,
            hartaTidakBergerak: rumah?.hartaTidakBergerak,
            statusHarta: rumah?.statusHarta,

            bloodType: kesehatan?.golonganDarah,
            weight: kesehatan?.beratBadan,
            height: kesehatan?.tinggiBadan,
            butawarna: kesehatan?.butaWarna,
            penyakitMenular: kesehatan?.penyakitMenular,
            penyakitNonMenular: kesehatan?.penyakitNonMenular,
            kesehatanMental: kesehatan?.kesehatanMental,
            perokok: kesehatan?.perokok,
            foto: berkas?.foto,
            rapor: berkas?.rapor,
            rumah_depan: berkas?.rumah_depan,
            ruangTamu: berkas?.rumah_ruangtamu,
            kamar: berkas?.rumah_kamar,
            sktm: berkas?.sktm,
            ss_ig: berkas?.ss_ig,
            kk: berkas?.kk,
            kip: berkas?.kip,
            bpjs: berkas?.bpjs,
            rekomendasi_surat: berkas?.rekomendasi_surat,
            tagihan_listrik: berkas?.tagihan_listrik,
            reels: berkas?.reels,
            mat3: Number(pres?.math_s3),
            mat4: Number(pres?.math_s4),
            indo3: Number(pres?.indo_s3),
            indo4: Number(pres?.indo_s4),
            eng3: Number(pres?.english_s3),
            eng4: Number(pres?.english_s4),
            ipa3: Number(pres?.ipa_s3),
            ipa4: Number(pres?.ipa_s4),
            pai3: Number(pres?.pai_s3),
            pai4: Number(pres?.pai_s4),

            rulesAgreement: aturan?.pernyataan1 === 'ya',
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
    doc.setFontSize(11);

    let y = 35;
    const lineHeight = 7;
    const maxWidth = 170;

    // Fungsi untuk menambah teks dengan auto wrap + page break
    const addWrappedText = (label: string, value: any) => {
      if (value == null || value === '') return;

      const fullText = `${label}: ${value}`;

      const lines = doc.splitTextToSize(fullText, maxWidth);

      lines.forEach((line: string) => {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += lineHeight;
      });

      y += 2; // spacing antar item
    };

    // ====== SECTION HELPER ======
    const addSection = (title: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);

      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.text(title, 20, y);
      y += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
    };

    // ====== LABEL MAP (sudah lengkap) ======
    const labelMap: Record<string, string> = {
      id: 'ID',
      nisn: 'NISN',
      nama: 'Nama Lengkap',
      alamat: 'Alamat',
      nik: 'NIK',
      kontak: 'Kontak',

      birthPlace: 'Tempat Lahir',
      birthDate: 'Tanggal Lahir',
      parentStatus: 'Status Orang Tua',
      familyStatus: 'Status Keluarga',
      socialAid: 'Bantuan Sosial',
      livingWith: 'Tinggal Dengan',
      livingWithCustom: 'Tinggal Dengan (Lainnya)',
      socialMedia: 'Media Sosial',
      address: 'Alamat Lengkap',
      schoolOrigin: 'Asal Sekolah',
      graduationYear: 'Tahun Kelulusan',
      npsn: 'NPSN Sekolah',
      province: 'Provinsi',
      city: 'Kota/Kabupaten',
      district: 'Kecamatan',
      sub_district: 'Kelurahan/Desa',
      rt: 'RT',
      rw: 'RW',
      postalCode: 'Kode Pos',
      childOrder: 'Anak Ke',

      fatherName: 'Nama Ayah',
      ayah_alamat: 'Alamat Ayah',
      fatherJob: 'Pekerjaan Ayah',
      ayah_tanggungan: 'Tanggungan Ayah',
      ayah_penghasilan: 'Penghasilan Ayah',

      motherName: 'Nama Ibu',
      motherJob: 'Pekerjaan Ibu',
      ibu_tanggungan: 'Tanggungan Ibu',
      ibu_penghasilan: 'Penghasilan Ibu',
      ibu_alamat: 'Alamat Ibu',

      phone: 'Nomor Telepon Ayah',
      phone2: 'Nomor Telepon Ibu',

      waliNama: 'Nama Wali',
      wali_alamat: 'Alamat Wali',
      wali_pekerjaan: 'Pekerjaan Wali',
      wali_tanggungan: 'Tanggungan Wali',
      wali_penghasilan: 'Penghasilan Wali',
      wali_hubungan: 'Hubungan Dengan Wali',
      wali_sumber: 'Sumber Nafkah Wali',

      info_ppdb: 'Info PPDB',
      saudara_beasiswa: 'Saudara Penerima Beasiswa',

      achievementField: 'Bidang Prestasi',
      achievementName: 'Nama Prestasi',
      achievementLevel: 'Level Prestasi',
      majorInterest: 'Minat Jurusan',
      foreignLanguage: 'Bahasa Asing',
      specialNeeds: 'Kebutuhan Khusus',

      houseType: 'Jenis Rumah',
      luasTanah: 'Luas Tanah',
      houseStatus: 'Status Kepemilikan Rumah',
      waterSource: 'Sumber Air',
      electricity: 'Daya Listrik',
      kendaraanDimiliki: 'Kendaraan Dimiliki',
      statusKendaraan: 'Status Kendaraan',
      hartaTidakBergerak: 'Harta Tidak Bergerak',
      statusHarta: 'Status Harta',

      bloodType: 'Golongan Darah',
      weight: 'Berat Badan',
      height: 'Tinggi Badan',
      butawarna: 'Buta Warna',
      penyakitMenular: 'Penyakit Menular',
      penyakitNonMenular: 'Penyakit Tidak Menular',
      kesehatanMental: 'Kesehatan Mental',
      perokok: 'Perokok',

      foto: 'Foto Siswa',
      rapor: 'Rapor',
      rumah_depan: 'Foto Rumah (Depan)',
      ruangTamu: 'Foto Ruang Tamu',
      kamar: 'Foto Kamar',
      sktm: 'Surat SKTM',
      ss_ig: 'Screenshot Instagram',
      kk: 'Kartu Keluarga',
      kip: 'KIP',
      bpjs: 'BPJS',
      rekomendasi_surat: 'Surat Rekomendasi',
      tagihan_listrik: 'Tagihan Listrik',
      reels: 'Video Reels',

      mat3: 'Matematika Semester 3',
      mat4: 'Matematika Semester 4',
      indo3: 'Bahasa Indonesia Semester 3',
      indo4: 'Bahasa Indonesia Semester 4',
      eng3: 'Bahasa Inggris Semester 3',
      eng4: 'Bahasa Inggris Semester 4',
      ipa3: 'IPA Semester 3',
      ipa4: 'IPA Semester 4',
      pai3: 'PAI Semester 3',
      pai4: 'PAI Semester 4',

      rulesAgreement: 'Setuju Dengan Aturan',
      status: 'Status Verifikasi',
    };

    // ============================
    // CETAK DATA PER SECTION
    // ============================

    // ---- Identitas ----
    addSection('IDENTITAS SISWA');
    ['nisn', 'nama', 'nik', 'kontak', 'alamat'].forEach((k) => addWrappedText(labelMap[k], student[k]));

    // ---- Biodata ----
    addSection('BIODATA & KELUARGA');
    ['birthPlace', 'birthDate', 'schoolOrigin', 'graduationYear', 'province', 'city', 'district', 'sub_district', 'rt', 'rw', 'postalCode', 'childOrder'].forEach((k) => addWrappedText(labelMap[k], student[k]));

    // ---- Orang Tua ----
    addSection('DATA ORANG TUA');
    ['fatherName', 'fatherJob', 'motherName', 'motherJob', 'phone', 'phone2'].forEach((k) => addWrappedText(labelMap[k], student[k]));

    // ---- Prestasi ----
    addSection('DATA PRESTASI');
    ['achievementField', 'achievementName', 'achievementLevel', 'majorInterest'].forEach((k) => addWrappedText(labelMap[k], student[k]));

    // ---- Rumah ----
    addSection('DATA RUMAH & EKONOMI');
    ['houseType', 'houseStatus', 'waterSource', 'electricity'].forEach((k) => addWrappedText(labelMap[k], student[k]));

    // ---- Kesehatan ----
    addSection('DATA KESEHATAN');
    ['bloodType', 'weight', 'height', 'butawarna', 'penyakitMenular', 'penyakitNonMenular'].forEach((k) => addWrappedText(labelMap[k], student[k]));

    doc.save(`data_${student.nama.replace(/\s+/g, '_')}.pdf`);
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

  const confirmDecision = async () => {
    if (!selectedStudent || !showDecisionConfirm) return;

    const keputusan = showDecisionConfirm.decision;
    const isLolos = keputusan === 'lolos';

    console.log('🟡 Mulai proses keputusan seleksi...', { siswa: selectedStudent, keputusan, isLolos });

    const newStatus = isLolos ? 'sudah' : 'tertolak';
    const notifTitle = isLolos ? 'Selamat! Anda Lolos' : 'Pemberitahuan Hasil Seleksi';
    const notifMessage = isLolos ? 'Selamat! Anda dinyatakan LOLOS pada tahap seleksi.' : 'Mohon maaf, Anda dinyatakan TIDAK LOLOS.';

    try {
      // === 1️⃣ UPDATE VALIDASI (tetap pakai PATCH) ===
      console.log('📡 Request PATCH /validasi:', {
        user_id: selectedStudent.id,
        validasi_pendaftaran: newStatus,
      });

      const updateRes = await fetch('https://backend_spmb.smktibazma.sch.id/api/pendaftaran/validasi', {
        method: 'PATCH', // 🔙 kembali ke PATCH
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: Number(selectedStudent.id),
          validasi_pendaftaran: newStatus,
        }),
      });

      // 🔐 Cek dulu apakah response berupa JSON
      const updateText = await updateRes.text();
      let updateJson;
      try {
        updateJson = JSON.parse(updateText);
      } catch (e) {
        console.error('❌ Backend tidak mengembalikan JSON:', updateText);
        alert('Server error pada validasi: kemungkinan endpoint salah atau method tidak sesuai.');
        return;
      }

      console.log('📥 Response validasi:', updateJson);

      if (!updateRes.ok) {
        alert(updateJson.message || 'Gagal memperbarui status!');
        return;
      }

      // === 2️⃣ KIRIM NOTIFIKASI (POST) ===
      console.log('📡 Kirim notifikasi:', { user_id: selectedStudent.id, notifTitle, notifMessage });

      const notifRes = await fetch('https://backend_spmb.smktibazma.sch.id/notifikasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: Number(selectedStudent.id),
          title: notifTitle,
          message: notifMessage,
        }),
      });

      const notifJson = await notifRes.json();
      console.log('📥 Response notifikasi:', notifJson);

      // === 3️⃣ UPDATE PENGUMUMAN (INI SAJA YANG PUT) ===
      console.log('📡 PUT /pengumuman:', {
        seleksi_berkas: isLolos ? 'ya' : 'tidak',
      });

      const pengumumanRes = await fetch(`https://backend_spmb.smktibazma.sch.id/api/pengumuman/${selectedStudent.id}`, {
        method: 'PUT', // 🔥 hanya di sini pakai PUT
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seleksi_berkas: isLolos ? 'ya' : 'tidak',
        }),
      });

      if (!pengumumanRes.ok) {
        console.warn('⚠️ Gagal update pengumuman seleksi');
      }

      // 💾 Update UI dan localStorage tetap sama...
      // (tidak disalin biar ringkas)
    } catch (error) {
      console.error('🔥 ERROR confirmDecision:', error);
      alert('Terjadi kesalahan server.');
    }

    setShowDecisionConfirm(null);
    setSelectedStudent(null);
    console.log('🏁 Proses selesai.\n');
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
    const XLSX = await import('xlsx');
    const { default: saveAs } = await import('file-saver');

    const combined = [...allDiterima.map((s) => ({ ...s, kategori: 'Diterima' })), ...tertolak.map((s) => ({ ...s, kategori: 'Tertolak' })), ...disetujui.map((s) => ({ ...s, kategori: 'Disetujui' }))];

    const dataToExport = combined.map((s) => ({
      // --- Identitas ---
      ID: s.id,
      NISN: s.nisn,
      Nama: s.nama,
      Alamat: s.alamat,
      NIK: s.nik,
      Kontak: s.kontak,

      // --- Biodata ---
      Tempat_Lahir: s.birthPlace,
      Tanggal_Lahir: s.birthDate,
      Status_Orang_Tua: s.parentStatus,
      Status_Keluarga: s.familyStatus,
      Bantuan_Sosial: s.socialAid,
      Tinggal_Dengan: s.livingWith,
      Tinggal_Dengan_Lainnya: s.livingWithCustom,
      Media_Sosial: s.socialMedia,
      Alamat_Lengkap: s.alamat,
      Asal_Sekolah: s.schoolOrigin,
      Tahun_Lulus: s.graduationYear,
      NPSN: s.npsn,
      Provinsi: s.province,
      Kota: s.city,
      Kecamatan: s.district,
      Kelurahan_Desa: s.sub_district,
      RT: s.rt,
      RW: s.rw,
      Kode_Pos: s.postalCode,
      Anak_Ke: s.childOrder,

      // --- Ayah ---
      Ayah_Nama: s.fatherName,
      Ayah_Alamat: s.ayah_alamat,
      Ayah_Pekerjaan: s.fatherJob,
      Ayah_Tanggungan: s.ayah_tanggungan,
      Ayah_Penghasilan: s.ayah_penghasilan,
      Ayah_Telepon: s.phone,

      // --- Ibu ---
      Ibu_Nama: s.motherName,
      Ibu_Alamat: s.ibu_alamat,
      Ibu_Pekerjaan: s.motherJob,
      Ibu_Tanggungan: s.ibu_tanggungan,
      Ibu_Penghasilan: s.ibu_penghasilan,
      Ibu_Telepon: s.phone2,

      // --- Wali ---
      Wali_Nama: s.waliNama,
      Wali_Alamat: s.wali_alamat,
      Wali_Pekerjaan: s.wali_pekerjaan,
      Wali_Tanggungan: s.wali_tanggungan,
      Wali_Penghasilan: s.wali_penghasilan,
      Wali_Hubungan: s.wali_hubungan,
      Wali_Sumber_Nafkah: s.wali_sumber,

      Informasi_PPDB: s.info_ppdb,
      Saudara_Penerima_Beasiswa: s.saudara_beasiswa,

      // --- Prestasi & Minat ---
      Bidang_Prestasi: s.achievementField,
      Nama_Prestasi: s.achievementName,
      Tingkat_Prestasi: s.achievementLevel,
      Minat_Jurusan: s.majorInterest,
      Bahasa_Asing: s.foreignLanguage,
      Kebutuhan_Khusus: s.specialNeeds,

      // --- Ekonomi & Rumah ---
      Rumah_Tipe: s.houseType,
      Luas_Tanah: s.luasTanah,
      Rumah_Status: s.houseStatus,
      Sumber_Air: s.waterSource,
      Listrik: s.electricity,
      Kendaraan_Dimiliki: s.kendaraanDimiliki,
      Status_Kendaraan: s.statusKendaraan,
      Harta_Tidak_Bergerak: s.hartaTidakBergerak,
      Status_Harta: s.statusHarta,

      // --- Kesehatan ---
      Gol_Darah: s.bloodType,
      Berat_Badan: s.weight,
      Tinggi_Badan: s.height,
      Buta_Warna: s.butawarna,
      Penyakit_Menular: s.penyakitMenular,
      Penyakit_Non_Menular: s.penyakitNonMenular,
      Kesehatan_Mental: s.kesehatanMental,
      Perokok: s.perokok,

      // --- Berkas ---
      Foto: s.foto,
      Rapor: s.rapor,
      Rumah_Depan: s.rumah_depan,
      Rumah_Ruang_Tamu: s.ruangTamu,
      Rumah_Kamar: s.kamar,
      SKTM: s.sktm,
      SS_IG: s.ss_ig,
      KK: s.kk,
      KIP: s.kip,
      BPJS: s.bpjs,
      Rekomendasi_Surat: s.rekomendasi_surat,
      Tagihan_Listrik: s.tagihan_listrik,
      Reels: s.reels,

      // --- Nilai Semester ---
      Matematika_Sem3: s.mat3,
      Matematika_Sem4: s.mat4,
      Indo_Sem3: s.indo3,
      Indo_Sem4: s.indo4,
      English_Sem3: s.eng3,
      English_Sem4: s.eng4,
      IPA_Sem3: s.ipa3,
      IPA_Sem4: s.ipa4,
      PAI_Sem3: s.pai3,
      PAI_Sem4: s.pai4,

      // --- Aturan ---
      Setuju_Aturan: s.rulesAgreement ? 'Ya' : 'Tidak',

      // --- Status ---
      Status_Verifikasi: s.status,
      Kategori: s.kategori,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const fileData = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });

    saveAs(fileData, 'data_semua_siswa.xlsx');
  };

  const sortedData = [...filteredViewList].sort((a, b) => {
    return new Date(a.created_at) - new Date(b.created_at);
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardLayout />

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-6 md:ml-4 transition-all duration-300">
        {/* Title */}
        <div className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-md border-b border-gray-200 mb-4 flex items-center gap-3">
          <button onClick={() => document.dispatchEvent(new CustomEvent('toggle-sidebar'))} className="md:hidden bg-[#1E3A8A] text-white p-2 rounded-md shadow">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold py-3 ">Dashboard / Table Data</h1>
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
          <div className="w-full overflow-hidden bg-white rounded-lg shadow">
            {/* WRAPPER SCROLL HORIZONTAL SUPAYA RESPONSIF */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm sm:text-base">
                <thead className="bg-gray-100 border-b">
                  <tr className="text-gray-700">
                    <th className="px-4 py-3 text-left">Waktu daftar</th>
                    <th className="px-4 py-3 text-left">Nama</th>
                    <th className="px-4 py-3 text-left">nisn</th>
                    <th className="px-4 py-3 text-left">NIK</th>
                    <th className="px-4 py-3 text-left">Kontak</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {currentItems.map((s) => {
                    // Hitung rata-rata nilai
                    const nilaiList = [Number(s.mat3), Number(s.mat4), Number(s.indo3), Number(s.indo4), Number(s.eng3), Number(s.eng4), Number(s.ipa3), Number(s.ipa4), Number(s.pai3), Number(s.pai4)].filter((n) => !isNaN(n));

                    const avg = nilaiList.length > 0 ? nilaiList.reduce((a, b) => a + b, 0) / nilaiList.length : 0;

                    // Kondisi warna hijau
                    const isGreen = avg > 90 && s.rulesAgreement === true;
                    const isYellow = avg < 90 && s.rulesAgreement === true;
                    const isRed = s.rulesAgreement === false;

                    console.log(s.nama, avg, s.rulesAgreement);

                    return (
                      <tr
                        key={s.id}
                        className={`hover:bg-gray-50 transition text-xs sm:text-sm
    ${isGreen ? 'bg-green-100' : ''}
    ${isYellow ? 'bg-yellow-100' : ''}
    ${isRed ? 'bg-red-100' : ''}
  `}
                      >
                        <td className="px-4 py-3 font-mono text-green-600 break-all">{s.waktu_daftar}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{s.nama}</td>

                        <td className="px-4 py-3 max-w-[140px] md:max-w-[260px] truncate">{s.nisn}</td>

                        <td className="px-4 py-3 break-all">{s.nik}</td>
                        <td className="px-4 py-3 break-all">{s.kontak}</td>

                        <td className="px-4 py-3">
                          <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible gap-2 justify-start md:justify-center pb-1">
                            {activeFilter === 'diterima' && (
                              <>
                                <button onClick={() => handleSetujuiClicked(s)} className="btn-action bg-green-500 hover:bg-green-600 text-white">
                                  <Check className="icon" /> Setujui
                                </button>

                                <button onClick={() => handleTolakClicked(s)} className="btn-action bg-yellow-500 hover:bg-yellow-600 text-white">
                                  <Clock4 className="icon" /> Tolak
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedStudent(s);
                                    handleDownloadPDF(s);
                                  }}
                                  className="btn-action bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                                >
                                  <Download className="icon" />
                                </button>

                                <button
                                  onClick={() => {
                                    sessionStorage.setItem('ppdb_diterima', JSON.stringify(filteredViewList));
                                    window.location.href = `/table-data/${s.id}`;
                                  }}
                                  className="btn-action bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <Eye className="icon" />
                                </button>
                              </>
                            )}

                            {activeFilter === 'tertolak' && (
                              <>
                                <button onClick={() => handleEditNoteTertolak(s)} className="btn-action bg-gray-100 hover:bg-gray-200 text-gray-700">
                                  Edit Note
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedStudent(s);
                                    setShowTertolakConfirm(true);
                                  }}
                                  disabled={!s.note}
                                  className={`btn-action bg-blue-500 hover:bg-blue-600 text-white ${!s.note ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  <Send className="icon" /> Kirim
                                </button>

                                <button onClick={() => handleSetujuiClicked(s)} className="btn-action bg-green-500 hover:bg-green-600 text-white">
                                  <Check className="icon" /> Setujui
                                </button>

                                <button
                                  onClick={() => {
                                    sessionStorage.setItem('ppdb_diterima', JSON.stringify(filteredViewList));
                                    window.location.href = `/table-data/${s.id}`;
                                  }}
                                  className="btn-action bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <Eye className="icon" />
                                </button>
                              </>
                            )}

                            {activeFilter === 'disetujui' && (
                              <>
                                <button onClick={() => handleDecisionOnDisetujui(s, 'lolos')} className="btn-action bg-green-500 hover:bg-green-600 text-white">
                                  Loloskan
                                </button>

                                <button onClick={() => handleDecisionOnDisetujui(s, 'tidak')} className="btn-action bg-red-500 hover:bg-red-600 text-white">
                                  Tidak
                                </button>
                                <button
                                  onClick={() => {
                                    sessionStorage.setItem('ppdb_diterima', JSON.stringify(filteredViewList));
                                    window.location.href = `/table-data/${s.id}`;
                                  }}
                                  className="btn-action bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <Eye className="icon" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

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

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-3 py-4">
              <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-3 py-1 rounded-lg border ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
                Prev
              </button>

              <span className="text-sm font-medium">
                Page {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg border ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
        <div className='flex flex-col gap-4 mt-5'>
          <div className='flex items-center gap-2'>
            <div className='w-10 h-10 bg-green-100 rounded-full'></div>
            <p className='text-center'>{'nilai > 90 dan setuju atas aturan yang berlaku'}</p>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-10 h-10 bg-yellow-100 rounded-full'></div>
            <p className='text-center'>{'nilai < 90 dan setuju atas aturan yang berlaku'}</p>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-10 h-10 bg-red-100 rounded-full'></div>
            <p className='text-center'>{'nilai < 90 dan belum setuju atas aturan yang berlaku'}</p>
          </div>
        </div>

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
