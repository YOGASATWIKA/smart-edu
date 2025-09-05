import { useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import MateriPokokModal from '../../components/modal/MateriPokokForm'; 

interface MateriPokok {
  Namajabatan: string;
  Tugasjabatan: string[];
  Keterampilan: string[];
  Klasifikasi: string;
}

const initialMateriList: MateriPokok[] = [
  {
    Namajabatan: "Fisioterapis Terampil",
    Tugasjabatan: ["UU Nomor 17 Tahun 2023", "UU Nomor 5 Tahun 2014"],
    Keterampilan: ["Standar kompetensi Fisioterapi", "Identifikasi problematika"],
    Klasifikasi: "Teknis"
  },
  {
    Namajabatan: "Analis Kebijakan",
    Tugasjabatan: ["Analisis data primer", "Penyusunan naskah akademik"],
    Keterampilan: ["Critical thinking", "Public speaking"],
    Klasifikasi: "Manajerial"
  }
];

export default function OutlineGenerator() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const [materiList, setMateriList] = useState<MateriPokok[]>(initialMateriList);
  const [selectedMateri, setSelectedMateri] = useState<MateriPokok | null>(null);

  const handleAddMateri = (newMateri: MateriPokok) => {
    if (!materiList.some(item => item.Namajabatan === newMateri.Namajabatan)) {
      setMateriList(prevList => [...prevList, newMateri]);
    }
    setSelectedMateri(newMateri);
    setIsModalOpen(false);
  };

  const handleSelectMateri = (materi: MateriPokok) => {
    setSelectedMateri(materi);
    setIsModalOpen(false);
  }

  return (
    <div>
      <PageMeta
        title="Outline Generator"
        description="Generate outline materi seleksi SKB-CPNS."
      />
      <PageBreadcrumb pageTitle="Outline Generator" />

      <div className="flex flex-col gap-8 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:flex-row xl:p-8">
        <div className="flex-1">
          <div className="mb-5 grid grid-cols-1 gap-6 sm:grid-cols-12">

            <div className="sm:col-span-8">
              <label htmlFor="materi-pokok" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Materi Pokok
              </label>
              <div 
                id="materi-pokok"
                onClick={() => setIsModalOpen(true)}
                className="w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              >
                {selectedMateri ? (
                  <span className="text-gray-900 dark:text-white">{selectedMateri.Namajabatan}</span>
                ) : (
                  <span className="text-gray-400">Pilih materi...</span>
                )}
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="model" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Model
              </label>
              <select
                id="model"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              >
                <option>Gemini</option>
                <option>Chat Gpt</option>
                <option>Claude</option>
                <option>Model Lain</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button className="w-full shrink-0 rounded-lg bg-gray-900 px-5 py-3 text-center font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 md:w-auto">
                Generate Outline
              </button>
            </div>
          </div>
          <div className="mb-5 flex min-h-[500px] w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/20">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Outline yang Anda buat akan muncul di sini.
              </p>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <MateriPokokModal
          materiList={materiList}
          onClose={() => setIsModalOpen(false)}
          onSelectMateri={handleSelectMateri}
          onAddMateri={handleAddMateri}
        />
      )}
    </div>
  );
}