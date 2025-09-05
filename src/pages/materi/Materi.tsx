// src/pages/MateriListPage.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import { getAllMateriPokok, MateriPokok } from '../../services/materiPokokService'; // Impor dari service

export default function MateriListPage() {
  const [materiList, setMateriList] = useState<MateriPokok[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMateri = async () => {
      try {
        // Panggil fungsi service untuk mengambil data
        const data = await getAllMateriPokok();
        setMateriList(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMateri();
  }, []); // Dijalankan sekali saat komponen pertama kali dimuat

  // Tampilan saat loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">Memuat daftar materi...</p>
      </div>
    );
  }

  // Tampilan jika terjadi error
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <p className="text-lg text-red-600">Terjadi kesalahan: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageMeta
        title="Daftar Materi Pokok"
        description="Lihat semua materi pokok yang telah dibuat."
      />
      <PageBreadcrumb pageTitle="Daftar Materi Pokok" />

      <div className="mb-6 flex justify-end">
        {/* Tombol ini akan mengarah ke halaman generator */}
        <Link
          to="/generate" // Sesuaikan dengan path routing Anda
          className="rounded-lg bg-gray-900 px-5 py-3 text-center font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          + Tambah Materi Baru
        </Link>
      </div>
      
      {/* Grid untuk menampilkan daftar materi */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {materiList.length > 0 ? (
          materiList.map((materi) => (
            <div 
              key={materi.id} 
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {materi.Namajabatan}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Klasifikasi: 
                <span className="font-medium text-gray-700 dark:text-gray-300"> {materi.Klasifikasi}</span>
              </p>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                 <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Tugas Pokok:</p>
                 <ul className="list-disc pl-5 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {/* Tampilkan maksimal 3 tugas untuk keringkasan */}
                    {materi.Tugasjabatan.slice(0, 3).map((tugas, index) => (
                      <li key={index}>{tugas}</li>
                    ))}
                    {materi.Tugasjabatan.length > 3 && <li>...dan lainnya</li>}
                 </ul>
              </div>
               <div className="mt-4 flex justify-end">
                  <button className="text-sm font-medium text-blue-600 hover:underline">
                    Lihat Detail
                  </button>
               </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">Belum ada materi yang dibuat.</p>
          </div>
        )}
      </div>
    </div>
  );
}