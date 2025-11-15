import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {Link} from "react-router";
import {useEffect, useState} from "react";
import RecentActivityList from '../../components/modal/recentActivityList.tsx';
import {getProfile, User} from "../../services/auth/authService.tsx";
import {PencilIcon} from "../../icons";


export default function SmartEdu() {
    const [name, setName] = useState('User');
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                console.error("Token tidak ditemukan, tidak bisa mengambil data user.");
                return;
            }
            try {
                const userData: User = await getProfile(token);

                const defaultName = "Pengguna Baru";

                setName(userData.name ?? defaultName);
            } catch (error) {
                console.error("Gagal mengambil data profil:", error);
            }
        };

        fetchUserData();
    }, []);

  return (
    <>
      <PageMeta
        title="Dashboard - SmartEdu"
        description="Dashboard untuk memulai proses menulis dengan bantuan AI."
      />
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="rounded-2xl border border-gray-200 bg-white p-3 py-7 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:px-10 xl:py-12">
        <div className="mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Selamat Datang {name}!
          </h2>
          <p className="mb-6 text-base text-gray-600 dark:text-gray-400 sm:text-lg">
            Siap untuk mengubah ide brilian Anda menjadi tulisan yang terstruktur? Mulailah dari sini.
          </p>
            <Link
                to="/write"
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
                <PencilIcon className="w-6 h-6" />
                <span>Buat Modul</span>
            </Link>

        </div>
      </div>
        <h2 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
            Aktifitas Terakhir
        </h2>
      <div className="rounded-2xl border border-gray-200 bg-white py-7 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:px-8 xl:py-10">

          <RecentActivityList />
      </div>
    </>
  );
};

