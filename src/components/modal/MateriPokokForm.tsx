import React, { useState } from 'react';

// Definisikan tipe untuk objek materi pokok
interface MateriPokok {
  Namajabatan: string;
  Tugasjabatan: string[];
  Keterampilan: string[];
  Klasifikasi: string;
}

// Definisikan tipe untuk props komponen
interface MateriPokokModalProps {
  materiList: MateriPokok[];
  onClose: () => void;
  onSelectMateri: (materi: MateriPokok) => void;
  onAddMateri: (materi: MateriPokok) => void;
}

const MateriPokokModal: React.FC<MateriPokokModalProps> = ({
  materiList,
  onClose,
  onSelectMateri,
  onAddMateri,
}) => {
  // State untuk beralih antara mode pilih dan mode tambah baru
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  
  // State untuk materi yang dipilih dari daftar yang ada
  const [selectedMateri, setSelectedMateri] = useState<MateriPokok | null>(null);

  // State untuk form input materi baru
  const [newMateri, setNewMateri] = useState<MateriPokok>({
    Namajabatan: '',
    Tugasjabatan: [''], // Mulai dengan satu input kosong
    Keterampilan: [''], // Mulai dengan satu input kosong
    Klasifikasi: '',
  });

  // --- Handlers untuk Form Input Dinamis ---

  // Menangani perubahan pada input array (Tugasjabatan & Keterampilan)
  const handleArrayInputChange = (
    field: 'Tugasjabatan' | 'Keterampilan',
    index: number,
    value: string
  ) => {
    const updatedArray = [...newMateri[field]];
    updatedArray[index] = value;
    setNewMateri({ ...newMateri, [field]: updatedArray });
  };

  // Menambah input baru ke array
  const addArrayInput = (field: 'Tugasjabatan' | 'Keterampilan') => {
    setNewMateri({ ...newMateri, [field]: [...newMateri[field], ''] });
  };

  // Menghapus input dari array
  const removeArrayInput = (field: 'Tugasjabatan' | 'Keterampilan', index: number) => {
    if (newMateri[field].length > 1) { // Cegah penghapusan input terakhir
      const filteredArray = newMateri[field].filter((_, i) => i !== index);
      setNewMateri({ ...newMateri, [field]: filteredArray });
    }
  };


  // --- Handlers untuk Aksi Utama ---

  // Konfirmasi pemilihan dari daftar yang ada
  const handleConfirmSelection = () => {
    if (selectedMateri) {
      onSelectMateri(selectedMateri);
      onClose();
    }
  };

  // Menambahkan materi baru dari form
  const handleAddNewMateri = () => {
    // Validasi sederhana
    if (newMateri.Namajabatan.trim() !== '') {
      // Membersihkan array dari string kosong sebelum mengirim
      const cleanedMateri = {
        ...newMateri,
        Tugasjabatan: newMateri.Tugasjabatan.filter(item => item.trim() !== ''),
        Keterampilan: newMateri.Keterampilan.filter(item => item.trim() !== ''),
      };
      onAddMateri(cleanedMateri);
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
    >
      <div
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800 transform transition-all"
      >
        {/* Modal Header */}
        <div className="mb-4 flex items-center justify-between border-b pb-3 dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isAddingNew ? 'Tambah Materi Pokok Baru' : 'Pilih Materi Pokok'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            ✕<span className="sr-only">Tutup modal</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {/* Checkbox untuk beralih mode */}
          <div className="mb-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAddingNew}
                onChange={() => setIsAddingNew(!isAddingNew)}
                className="sr-only peer"
              />
               <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Tambahkan Materi Pokok Baru
              </span>
            </label>
          </div>
          
          {/* Tampilan Kondisional: Form Tambah Baru atau Daftar Pilihan */}
          {isAddingNew ? (
            // FORM UNTUK MENAMBAH MATERI BARU
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Jabatan</label>
                <input
                  type="text"
                  value={newMateri.Namajabatan}
                  onChange={(e) => setNewMateri({...newMateri, Namajabatan: e.target.value})}
                  placeholder="Contoh: Fisioterapis Terampil"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tugas Jabatan</label>
                {newMateri.Tugasjabatan.map((tugas, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={tugas}
                      onChange={(e) => handleArrayInputChange('Tugasjabatan', index, e.target.value)}
                      placeholder={`Tugas Jabatan ${index + 1}`}
                      className="flex-grow rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <button onClick={() => removeArrayInput('Tugasjabatan', index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full">-</button>
                  </div>
                ))}
                <button onClick={() => addArrayInput('Tugasjabatan')} className="text-sm text-blue-600 hover:underline dark:text-blue-500">+ Tambah Tugas</button>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Keterampilan</label>
                {newMateri.Keterampilan.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleArrayInputChange('Keterampilan', index, e.target.value)}
                      placeholder={`Keterampilan ${index + 1}`}
                      className="flex-grow rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <button onClick={() => removeArrayInput('Keterampilan', index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full">-</button>
                  </div>
                ))}
                <button onClick={() => addArrayInput('Keterampilan')} className="text-sm text-blue-600 hover:underline dark:text-blue-500">+ Tambah Keterampilan</button>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Klasifikasi</label>
                <input
                  type="text"
                  value={newMateri.Klasifikasi}
                  onChange={(e) => setNewMateri({...newMateri, Klasifikasi: e.target.value})}
                  placeholder="Contoh: Teknis"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

            </div>
          ) : (
            // DAFTAR UNTUK MEMILIH MATERI YANG SUDAH ADA
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Pilih salah satu materi pokok yang sudah ada di bawah ini.</p>
              {materiList.map((materi, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedMateri(materi)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors dark:border-gray-600 ${
                    selectedMateri?.Namajabatan === materi.Namajabatan
                      ? 'bg-blue-100 border-blue-500 dark:bg-blue-900/50 dark:border-blue-500'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <p className="font-semibold text-gray-900 dark:text-white">{materi.Namajabatan}</p>
                </div>
              ))}
              {materiList.length === 0 && (
                <p className='text-center text-gray-500 dark:text-gray-400 py-4'>Belum ada materi pokok yang tersedia.</p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end gap-3 border-t pt-4 dark:border-gray-600">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Batal
          </button>
          
          {isAddingNew ? (
            <button
              onClick={handleAddNewMateri}
              disabled={!newMateri.Namajabatan.trim()}
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Simpan Materi Baru
            </button>
          ) : (
             <button
              onClick={handleConfirmSelection}
              disabled={!selectedMateri}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              Pilih Materi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MateriPokokModal;



// import React, { useState } from 'react';

// // Definisikan tipe untuk props yang akan diterima komponen ini
// interface MateriPokokModalProps {
//   materiList: string[];
//   onClose: () => void;
//   onSelectMateri: (materi: string) => void;
//   onAddMateri: (materi: string) => void;
// }

// const MateriPokokModal: React.FC<MateriPokokModalProps> = ({
//   materiList,
//   onClose,
//   onSelectMateri,
//   onAddMateri,
// }) => {
//   // State dengan tipe eksplisit: bisa string atau null
//   const [selected, setSelected] = useState<string | null>(null);
//   // State dengan tipe string
//   const [newMateri, setNewMateri] = useState<string>('');

//   const handleSelect = (materi: string) => {
//     setSelected(materi);
//   };

//   const handleAddNewMateri = () => {
//     if (newMateri.trim() !== '') {
//       onAddMateri(newMateri);
//       setNewMateri(''); // Kosongkan input setelah ditambahkan
//     }
//   };

//   const handleConfirm = () => {
//     if (selected) {
//       onSelectMateri(selected);
//       onClose();
//     }
//   };

//   return (
//     // Backdrop / Overlay
//     <div
//       onClick={onClose}
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
//     >
//       {/* Modal Content */}
//       <div
//         // Memberi tipe pada event mouse untuk type safety
//         onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
//         className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
//       >
//         {/* Modal Header */}
//         <div className="mb-4 flex items-center justify-between">
//           <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//             Input Materi Pokok
//           </h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
//           >
//             ✕<span className="sr-only">Tutup modal</span>
//           </button>
//         </div>

//         {/* Modal Body */}
//         {/* <div> */}
//           {/* Form Tambah Materi Baru */}
//           <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nama Jabatan</p>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={newMateri}
//               // Memberi tipe pada event input
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMateri(e.target.value)}
//               placeholder="Contoh: Tes Wawasan Kebangsaan"
//               className="mt-3 mb-3 flex-grow rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
//             />
//           </div>
//           <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pengetahuan Umum</p>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={newMateri}
//               // Memberi tipe pada event input
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMateri(e.target.value)}
//               placeholder="Contoh: Tes Wawasan Kebangsaan"
//               className="mt-3 mb-3 flex-grow rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
//             />
//           </div>
//           <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pengetahuan Khusus</p>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={newMateri}
//               // Memberi tipe pada event input
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMateri(e.target.value)}
//               placeholder="Contoh: Tes Wawasan Kebangsaan"
//               className="mt-3 mb-3 flex-grow rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
//             />
//           </div>
//           <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pengetahuan Khusus</p>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={newMateri}
//               // Memberi tipe pada event input
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMateri(e.target.value)}
//               placeholder="Contoh: Tes Wawasan Kebangsaan"
//               className="mt-3 mb-3 flex-grow rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
//             />
//           </div>
//         {/* </div> */}

//         {/* Modal Footer */}
//         <div className="mt-6 flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
//           >
//             Batal
//           </button>
//           <button
//             onClick={handleConfirm}
//             disabled={!selected}
//             className="rounded-lg bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
//           >
//             Pilih Materi
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MateriPokokModal;