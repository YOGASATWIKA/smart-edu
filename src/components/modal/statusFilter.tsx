interface StatusFilterProps {
  options: string[];
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export default function StatusFilter({ options, selectedStatus, onStatusChange }: StatusFilterProps) {
  // Gabungkan opsi "Semua" dengan opsi dari props
  const filterOptions = ['Semua', ...options];

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-8">
      <span className="font-semibold text-gray-700 dark:text-gray-300">Filter Status:</span>
      {filterOptions.map((status) => {
        // Cek apakah tombol ini adalah yang sedang aktif
        const isActive = (status === 'Semua' && selectedStatus === '') || selectedStatus === status;

        return (
          <button
            key={status}
            // Jika tombol 'Semua' diklik, kirim string kosong. Jika tidak, kirim statusnya.
            onClick={() => onStatusChange(status === 'Semua' ? '' : status)}
            className={`
              px-4 py-2 text-sm font-medium rounded-full transition-all duration-200
              ${isActive
                ? 'bg-blue-600 text-white shadow' // Style untuk tombol aktif
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600' // Style untuk tombol non-aktif
              }
            `}
          >
            {status}
          </button>
        );
      })}
    </div>
  );
}