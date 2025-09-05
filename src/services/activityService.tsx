// src/services/activityService.ts

// Definisikan bentuk objek aktivitas kita
export interface Activity {
  id: string;
  type: 'ADD_MATERI_POKOK' | 'GENERATE_OUTLINE' | 'GENERATE_MATERI' | 'DOWNLOAD_MATERI';
  title: string;
  timestamp: string; // Simpan sebagai string ISO agar mudah di-parse
  description: string;
}

const STORAGE_KEY = 'userActivities';

/**
 * Mengambil semua aktivitas dari Local Storage.
 */
export const getActivities = (): Activity[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  // Jika ada data, ubah dari string JSON ke array. Jika tidak, kembalikan array kosong.
  return data ? JSON.parse(data) : [];
};

/**
 * Menambahkan satu aktivitas baru dan menyimpannya ke Local Storage.
 */
export const addActivity = (newActivity: Omit<Activity, 'id' | 'timestamp'>): void => {
  // Ambil semua aktivitas yang sudah ada
  const existingActivities = getActivities();

  // Buat objek aktivitas lengkap dengan ID dan timestamp
  const activityToAdd: Activity = {
    ...newActivity,
    id: `activity-${Date.now()}`,
    timestamp: new Date().toISOString(), // Format standar untuk tanggal
  };

  // Tambahkan aktivitas baru ke paling atas, batasi hanya 5 aktivitas terakhir
  const updatedActivities = [activityToAdd, ...existingActivities].slice(0, 5);

  // Simpan kembali ke Local Storage sebagai string JSON
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedActivities));
};