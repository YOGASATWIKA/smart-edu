import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useNavigate } from 'react-router'; // Menggunakan 'react-router-dom'
import axios from 'axios'; // 1. Tambah import untuk axios

export default function UserDropdown() {
  // State untuk dropdown (tidak berubah)
  const [isOpen, setIsOpen] = useState(false);
  
  // 2. Siapkan state untuk menyimpan nama dan URL gambar
  const [name, setName] = useState('Loading...'); // Teks default saat data dimuat
  const [pictureUrl, setPictureUrl] = useState('../../../public/images/profile.jpg');

  const navigate = useNavigate(); 

  // 3. Gunakan useEffect untuk mengambil data saat komponen dimuat
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error("Tidak ada token, tidak bisa mengambil data user.");
        setName('Guest');
        return;
      }

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // Ambil data nama dan gambar dari backend
        const nameResponse = await axios.get('http://localhost:3001/api/profile/name', config);
        const pictureResponse = await axios.get('http://localhost:3001/api/profile/picture', config);

        // Perbarui state dengan data yang diterima
        if (nameResponse.data.name) {
          setName(nameResponse.data.name);
        }
        if (pictureResponse.data.picture) {
          setPictureUrl(pictureResponse.data.picture);
        }

      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        setName('Error');
      }
    };

    fetchUserData();
  }, []); // Array kosong memastikan ini hanya berjalan sekali

  // Fungsi logout (tidak berubah)
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/signin');
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          {/* 4. Gunakan state pictureUrl untuk gambar */}
          <img src={pictureUrl} alt="User" className="object-cover w-full h-full" />
        </span>

        {/* 4. Gunakan state name untuk nama */}
        <span className="block mr-1 font-medium text-theme-sm">{name}</span>
        
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-3 px-3 py-2 mt-3 font-medium text-left text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          {/* ... SVG Anda ... */}
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}