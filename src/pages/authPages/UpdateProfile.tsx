import { useState, useEffect } from "react";
import { updateProfile, uploadImageProfile, getProfile } from "../../services/auth/authService";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function UpdateProfilePage() {
    const [name, setName] = useState("");
    const [picture, setPicture] = useState("");
    const [email, setEmail] = useState("");

    const [uploading, setUploading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const navigate = useNavigate();

    const token = localStorage.getItem("authToken") || "";
    const userId = localStorage.getItem("userId") || "";

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfile(token);
                setName(res.name || "");
                setEmail(res.email || "");
                setPicture(res.picture || "");
            } catch (err) {
                console.error("Gagal mengambil profile:", err);
            } finally {
                setLoadingData(false);
            }
        };

        fetchProfile();
    }, [token]);

    const handleFileUpload = async (file: File) => {
        try {
            setUploading(true);
            const res = await uploadImageProfile(token, file);
            setPicture(res.url);
        } catch (err) {
            console.error("Upload gaagal:", err);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await updateProfile(token, { email, picture, name }, userId);
            navigate("/", { replace: true });
            window.location.reload();
            Swal.fire("Berhasil", res.message || "Profile berhasil diperbarui!", "success");
        } catch (err) {
            console.error("Update profile gagal", err);
        }
    };

    // 🔄 Loading sebelum data masuk
    if (loadingData) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-600 dark:text-gray-300">
                Memuat data profile...
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center p-6">
            <div className="shadow-2xl rounded-3xl w-full max-w-4xl p-10 bg-white dark:bg-gray-900">

                <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-10">
                    Update Profile
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="relative p-4 rounded-2xl transition">

                        {/* input file hidden */}
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                            }}
                        />

                        {/* FOTO PROFIL */}
                        {uploading ? (
                            <p className="text-center text-gray-500 dark:text-gray-300 py-10">
                                Mengupload foto...
                            </p>
                        ) : picture ? (
                            <div className="flex justify-center">
                                <img
                                    src={picture}
                                    alt="Profile"
                                    className="w-40 h-40 rounded-full object-cover shadow-md border border-gray-300 dark:border-gray-600"
                                />
                            </div>
                        ) : (
                            <div className="text-center text-gray-600 dark:text-gray-300 py-10">
                                <p className="font-medium">Belum ada foto</p>
                            </div>
                        )}
                        <div className="flex justify-center mt-3">
                            <button
                                type="button"
                                onClick={() => document.getElementById("fileInput")?.click()}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition font-medium"
                            >
                                Upload Foto
                            </button>
                        </div>
                    </div>


                    {/* FORM INPUT */}
                    <div className="md:col-span-2">
                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                                Nama
                            </label>
                            <input
                                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700
                        border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white
                        focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                placeholder="Masukkan nama"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                                Email
                            </label>
                            <input
                                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700
                        border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white
                        focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                placeholder="Masukkan email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3
                        rounded-2xl shadow-lg transition active:scale-[0.98]"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
