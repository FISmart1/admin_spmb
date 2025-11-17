// Updated StudentDetail component matching detailed data structure from uploaded file
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Menu } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';

interface StudentFull {
  fullName: string;
  nisn: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  address: string;
  schoolOrigin: string;

  fatherName: string;
  fatherJob: string;
  motherName: string;
  motherJob: string;
  phone: string;
  phone2: string;
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
}

export default function StudentDetail() {
  const router = useRouter();
  const params = useParams();

  const [student, setStudent] = useState<StudentFull | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      if (!params.id) return;

      const res = await fetch(`https://backend_spmb.smktibazma.sch.id/api/pendaftaran/user/${params.id}/full`);
      const data = await res.json();

      if (!data) return;

      setStudent({
        fullName: data.bio?.fullName,
        nisn: data.bio?.nisn,
        nik: data.bio?.nik,
        birthPlace: data.bio?.birthPlace,
        birthDate: data.bio?.birthDate
          ? new Date(data.bio.birthDate).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
          : '-',

        address: data.bio?.addressDetail,
        schoolOrigin: data.bio?.schoolOrigin,

        fatherName: data.orangtua?.ayah_nama,
        fatherJob: data.orangtua?.ayah_pekerjaan,
        motherName: data.orangtua?.ibu_nama,
        motherJob: data.orangtua?.ibu_pekerjaan,
        phone: data.orangtua?.ayah_telepon,
        phone2: data.orangtua?.ibu_telepon,
        parentAddress: data.orangtua?.ayah_alamat,

        achievementField: data.pres?.achievement,
        achievementName: data.pres?.hafalan,
        achievementLevel: data.pres?.organization,
        majorInterest: data.pres?.hobby,

        houseType: data.rumah?.kualitasRumah,
        houseStatus: data.rumah?.statusKepemilikanRumah,
        waterSource: data.rumah?.sumberAir,
        electricity: data.rumah?.dayaListrik,

        bloodType: data.kesehatan?.golonganDarah,
        weight: data.kesehatan?.beratBadan,
        height: data.kesehatan?.tinggiBadan,
        butawarna: data.kesehatan?.butaWarna,
        penyakitMenular: data.kesehatan?.penyakitMenular,
        penyakitNonMenular: data.kesehatan?.penyakitNonMenular,
        foto: data.berkas?.foto,
        rapor: data.berkas?.rapor,
        rumah_depan: data.berkas?.rumah_depan,
        ruangTamu: data.berkas?.rumah_ruangtamu,
        kamar: data.berkas?.rumah_kamar,
        sktm: data.berkas?.sktm,
        ss_ig: data.berkas?.ss_ig,
        kk: data.berkas?.kk,
        kip: data.berkas?.kip,
        bpjs: data.berkas?.bpjs,
        rekomendasi_surat: data.berkas?.rekomendasi_surat,
        tagihan_listrik: data.berkas?.tagihan_listrik,
        reels: data.berkas?.reels,
        mat3: data.pres?.math_s3,
        mat4: data.pres?.math_s4,
        indo3: data.pres?.indo_s3,
        indo4: data.pres?.indo_s4,
        eng3: data.pres?.english_s3,
        eng4: data.pres?.english_s4,
        ipa3: data.pres?.ipa_s3,
        ipa4: data.pres?.ipa_s4,
        pai3: data.pres?.pai_s3,
        pai4: data.pres?.pai_s4,
        rulesAgreement: data.aturan?.pernyataan1 === 'ya',
      });
    }

    fetchDetail();
  }, [params.id]);

  const BASE_IMAGE_URL = 'https://backend_spmb.smktibazma.sch.id/uploads/';

  function img(file?: string) {
    return file ? BASE_IMAGE_URL + file : null;
  }

  if (!student) {
    return (
      <div className="flex h-screen overflow-hidden">
        <DashboardLayout />
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <div className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-md border-b border-gray-200 mb-4">
            <h1 className="text-xl font-semibold py-3">Dashboard / Table Data / Detail Data Siswa</h1>
          </div>
          <div className="w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <p className="text-gray-600 text-center">Memuat data siswa...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardLayout />

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 md:ml-4">
        <div className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-md border-b border-gray-200 mb-4 flex items-center gap-3">
          <button onClick={() => document.dispatchEvent(new CustomEvent('toggle-sidebar'))} className="md:hidden bg-[#1E3A8A] text-white p-2 rounded-md shadow">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl md:text-2xl font-semibold py-3">Dashboard / Table Data / Detail Data Siswa</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft className="w-5 h-5" /> Kembali
          </button>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">Detail Data Siswa</h1>

          {/* GRID DATA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
            <DetailItem label="Nama Lengkap" value={student.fullName} />
            <DetailItem label="NISN" value={student.nisn} />
            <DetailItem label="NIK" value={student.nik} />
            <DetailItem label="Tempat Lahir" value={student.birthPlace} />
            <DetailItem label="Tanggal Lahir" value={student.birthDate} />
            <DetailItem label="Alamat" value={student.address} />
            <DetailItem label="Asal Sekolah" value={student.schoolOrigin} />

            {/* Orang tua */}
            <DetailItem label="Nama Ayah" value={student.fatherName} />
            <DetailItem label="Pekerjaan Ayah" value={student.fatherJob} />
            <DetailItem label="Nama Ibu" value={student.motherName} />
            <DetailItem label="Pekerjaan Ibu" value={student.motherJob} />
            <DetailItem label="Telepon Orang Tua" value={student.phone || student.phone2} />
            <DetailItem label="Alamat Orang Tua" value={student.parentAddress} />

            {/* Prestasi */}
            <DetailItem label="Prestasi" value={student.achievementField} />
            <DetailItem label="Jumlah Hafalan" value={student.achievementName} />
            <DetailItem label="Organisasi" value={student.achievementLevel} />
            <DetailItem label="Hobi" value={student.majorInterest} />

            {/* Rumah */}
            <DetailItem label="Jenis Rumah" value={student.houseType} />
            <DetailItem label="Status Kepemilikan Rumah" value={student.houseStatus} />
            <DetailItem label="Sumber Air" value={student.waterSource} />
            <DetailItem label="Daya Listrik" value={student.electricity} />

            {/* Kesehatan */}
            <DetailItem label="Golongan Darah" value={student.bloodType} />
            <DetailItem label="Berat Badan" value={student.weight} />
            <DetailItem label="Tinggi Badan" value={student.height} />
            <DetailItem label="Buta Warna" value={student.butawarna} />
            <DetailItem label="Penyakit Menular" value={student.penyakitMenular} />
            <DetailItem label="Penyakit Tidak Menular" value={student.penyakitNonMenular} />
            <DetailItem label="Rata rata Nilai Matematika" value={student.mat3 && student.mat4 ? ((Number(student.mat3) + Number(student.mat4)) / 2).toFixed(2) : '-'} />
            <DetailItem label="Rata rata Nilai Indonesia" value={student.indo3 && student.indo4 ? ((Number(student.indo3) + Number(student.indo4)) / 2).toFixed(2) : '-'} />
            <DetailItem label="Rata rata nilai English" value={student.eng3 && student.eng4 ? ((Number(student.eng3) + Number(student.eng4)) / 2).toFixed(2) : '-'} />
            <DetailItem label="Rata rata nilai IPA" value={student.ipa3 && student.ipa4 ? ((Number(student.ipa3) + Number(student.ipa4)) / 2).toFixed(2) : '-'} />
            <DetailItem label="Rata rata nilai PAI" value={student.pai3 && student.pai4 ? ((Number(student.pai3) + Number(student.pai4)) / 2).toFixed(2) : '-'} />

            <DetailItem label="Pernyataan Aturan" value={student.rulesAgreement ? 'Sudah Menyetujui' : 'Belum Menyetujui'} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Foto Siswa</p>
                {student.foto && student.foto.toLowerCase().endsWith('.pdf') ? (
                  <a href={img(student.foto) || ''} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Lihat Rapor (PDF)
                  </a>
                ) : (
                  <img src={img(student.foto) || ' '} className="w-full rounded-xl object-cover border" alt="Rapor" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Foto SKTM</p>
                {student.sktm && student.sktm.toLowerCase().endsWith('.pdf') ? (
                  <a href={img(student.sktm) || ''} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Lihat Rapor (PDF)
                  </a>
                ) : (
                  <img src={img(student.sktm) || ' '} className="w-full rounded-xl object-cover border" alt="Rapor" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Foto SS IG</p>
                {student.ss_ig && student.ss_ig.toLowerCase().endsWith('.pdf') ? (
                  <a href={img(student.ss_ig) || ''} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Lihat Rapor (PDF)
                  </a>
                ) : (
                  <img src={img(student.ss_ig) || ' '} className="w-full rounded-xl object-cover border" alt="Rapor" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Kartu Keluarga</p>
                {student.kk && student.kk.toLowerCase().endsWith('.pdf') ? (
                  <a href={img(student.kk) || ''} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Lihat Rapor (PDF)
                  </a>
                ) : (
                  <img src={img(student.kk) || ' '} className="w-full rounded-xl object-cover border" alt="Rapor" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">KIP</p>
                {student.kip && student.kip.toLowerCase().endsWith('.pdf') ? (
                  <a href={img(student.kip) || ''} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Lihat Rapor (PDF)
                  </a>
                ) : (
                  <img src={img(student.kip) || ' '} className="w-full rounded-xl object-cover border" alt="Rapor" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">BPJS</p>
                {student.bpjs && student.bpjs.toLowerCase().endsWith('.pdf') ? (
                  <a href={img(student.bpjs) || ''} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Lihat Rapor (PDF)
                  </a>
                ) : (
                  <img src={img(student.bpjs) || ' '} className="w-full rounded-xl object-cover border" alt="Rapor" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Surat Rekomendasi</p>
               {student.rekomendasi_surat && student.rekomendasi_surat.toLowerCase().endsWith('.pdf') ? (
                  <a href={img(student.rekomendasi_surat) || ''} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Lihat Rapor (PDF)
                  </a>
                ) : (
                  <img src={img(student.rekomendasi_surat) || ' '} className="w-full rounded-xl object-cover border" alt="Rapor" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Tagihan Listrik</p>
                {student.tagihan_listrik && student.tagihan_listrik.toLowerCase().endsWith('.pdf') ? (
                  <a href={img(student.tagihan_listrik) || ''} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Lihat Rapor (PDF)
                  </a>
                ) : (
                  <img src={img(student.tagihan_listrik) || ' '} className="w-full rounded-xl object-cover border" alt="Rapor" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Bukti Reels</p>
                {student.reels && student.reels.toLowerCase().endsWith('.pdf') ? (
                  <a href={img(student.reels) || ''} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Lihat Rapor (PDF)
                  </a>
                ) : (
                  <img src={img(student.reels) || ' '} className="w-full rounded-xl object-cover border" alt="Rapor" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Rumah Tampak Depan</p>
                {student.rumah_depan && student.rumah_depan.toLowerCase().endsWith('.pdf') ? (
                  <a href={img(student.rumah_depan) || ''} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Lihat Rapor (PDF)
                  </a>
                ) : (
                  <img src={img(student.rumah_depan) || ' '} className="w-full rounded-xl object-cover border" alt="Rapor" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Ruang Tamu</p>
                {student.ruangTamu && student.ruangTamu.toLowerCase().endsWith('.pdf') ? (
                  <a href={img(student.ruangTamu) || ''} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Lihat Rapor (PDF)
                  </a>
                ) : (
                  <img src={img(student.ruangTamu) || ' '} className="w-full rounded-xl object-cover border" alt="Rapor" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Kamar Tidur</p>
                {student.kamar && student.kamar.toLowerCase().endsWith('.pdf') ? (
                  <a href={img(student.kamar) || ''} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Lihat Rapor (PDF)
                  </a>
                ) : (
                  <img src={img(student.kamar) || ' '} className="w-full rounded-xl object-cover border" alt="Rapor" />
                )}
              </div>
            </div>

            {student.rapor && student.rapor.toLowerCase().endsWith('.pdf') ? (
                  <a href={img(student.rapor) || ''} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Lihat Rapor (PDF)
                  </a>
                ) : (
                  <img src={img(student.rapor) || ' '} className="w-full rounded-xl object-cover border" alt="Rapor" />
                )}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500">© 2026 SMK TI Bazma — Sistem Informasi PPDB</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md">
      <p className="text-xs uppercase text-gray-500 mb1">{label}</p>
      <p className="text-md font-semibold text-gray-800">{value}</p>
    </motion.div>
  );
}
