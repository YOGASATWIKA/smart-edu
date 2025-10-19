import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useNavigate } from 'react-router';
import { getProfile, User } from '../../services/auth/authService';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('User');
  const [pictureUrl, setPictureUrl] = useState('../../../public/images/profile_default.jpg');
  const navigate = useNavigate();

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
                const defaultPictureUrl = "../../../public/images/profile_default.jpg";

                setName(userData.name ?? defaultName);
                if (userData.picture == null){
                    setPictureUrl(defaultPictureUrl);
                }else setPictureUrl(userData.picture);
            } catch (error) {
                console.error("Gagal mengambil data profil:", error);
            }
        };

        fetchUserData();
    }, []);

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
          <img src={pictureUrl} alt="User" className="object-cover w-full h-full" />
        </span>
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
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}