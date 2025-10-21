import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {Link} from "react-router";
import {useEffect, useState} from "react";
import RecentActivityList from '../../components/modal/recentActivityList.tsx';
import {getProfile, User} from "../../services/auth/authService.tsx";


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
      <div className="rounded-2xl border border-gray-200 bg-white p-5 py-7 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:px-10 xl:py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Selamat Datang {name}!
          </h2>
          <p className="mb-10 text-base text-gray-600 dark:text-gray-400 sm:text-lg">
            Siap untuk mengubah ide brilian Anda menjadi tulisan yang terstruktur? Mulailah dari sini.
          </p>
            <Link to= "/write"
                  className="mt-6 w-3 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition group-hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:group-hover:bg-blue-600"
            >
                Buat Modul
            </Link>
          {/*<div className="group mx-auto block max-w-md text-left no-underline">*/}
          {/*  <div*/}
          {/*    className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-8 text-center transition-all duration-300 hover:border-blue-500 hover:bg-white hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500 dark:hover:bg-gray-700"*/}
          {/*  >*/}
          {/*    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">*/}
          {/*       <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"><path d="M12 3c-1.2 0-2.4.6-3 1.7A3.5 3.5 0 0 0 5 8c0 1.7 1.3 3 3 3h8c1.7 0 3-1.3 3-3a3.5 3.5 0 0 0-4-3.7c-.6-1.1-1.8-1.7-3-1.7Z"></path><path d="M12 12v10"></path><path d="M16 16v-2"></path><path d="M8 16v-2"></path></svg>*/}
          {/*    </div>*/}
          {/*    <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white">*/}
          {/*      Buat Modul Baru*/}
          {/*    </h3>*/}
          {/*    <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">*/}
          {/*      Mulailah dengan membuat kerangka tulisan yang terstruktur untuk materi terbaik anda.*/}
          {/*    </p>*/}
          {/*    <Link to= "/modul"*/}
          {/*      className="mt-6 w-3 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition group-hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:group-hover:bg-blue-600"*/}
          {/*    >*/}
          {/*      Buat Modul*/}
          {/*    </Link>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </div>
        <h2 className="mt-8 text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
            Aktifitas Terakhir
        </h2>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 py-7 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:px-8 xl:py-10">

          <RecentActivityList />
      </div>
    </>
  );
};

