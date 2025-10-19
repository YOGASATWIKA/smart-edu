import React, { useState } from "react";
import { createModel, Promt } from "../../../services/model/modelService";
import Swal from "sweetalert2";
import { Plus, Trash } from "lucide-react";




const CreateModelForm: React.FC = () => {
    const [model, setModel] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [variables] = useState<string[]>([
        "NamaJabatan",
        "TugasJabatan",
        "Keterampilan",
    ]);

    const [steps, setSteps] = useState<Promt[]>([
        { role: "system", content: "" },
    ]);

    const handleAddStep = () => {
        setSteps([...steps, { role: "human", content: "" }]);
    };

    const handleRemoveStep = (index: number) => {
        const updated = steps.filter((_, i) => i !== index);
        setSteps(updated);
    };

    const handleChangeStep = (index: number, field: keyof Promt, value: string) => {
        const updated = [...steps];
        updated[index][field] = value;
        setSteps(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!model.trim()) {
            Swal.fire("Peringatan", "Nama model wajib diisi!", "warning");
            return;
        }

        const payload = {
            model,
            description,
            steps,
            variables,
            is_active: isActive,
        };

        try {
            setIsLoading(true);
            const res = await createModel(payload);
            Swal.fire("Berhasil", res.message || "Model berhasil dibuat!", "success");

            // Reset form
            setModel("");
            setDescription("");
            setSteps([{ role: "system", content: "" }]);
            setIsActive(true);
        } catch (err: any) {
            Swal.fire(
                "Gagal",
                err.response?.data?.message || "Terjadi kesalahan saat membuat model.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6"
        >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Tambah Model Baru
            </h2>

            {/* Nama Model */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama Model <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Contoh: Default"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                />
            </div>

            {/* Deskripsi */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deskripsi
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tuliskan deskripsi model..."
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 outline-none"
                    rows={3}
                />
            </div>

            {/* Steps */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Langkah Prompt (Steps)
                </label>

                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="border rounded-lg p-4 mb-3 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <select
                                value={step.role}
                                onChange={(e) =>
                                    handleChangeStep(index, "role", e.target.value)
                                }
                                className="px-2 py-1 border rounded-md text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 outline-none"
                            >
                                <option value="system">System</option>
                                <option value="human">Human</option>
                            </select>

                            {steps.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveStep(index)}
                                    className="text-red-500 hover:text-red-700 transition"
                                >
                                    <Trash size={18} />
                                </button>
                            )}
                        </div>

                        <textarea
                            value={step.content}
                            onChange={(e) =>
                                handleChangeStep(index, "content", e.target.value)
                            }
                            placeholder="Isi konten prompt..."
                            rows={3}
                            className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddStep}
                    className="mt-2 flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                    <Plus size={16} /> Tambah Step
                </button>
            </div>

            {/* Status Aktif */}
            <div className="flex items-center gap-2">
                <input
                    id="isActive"
                    type="checkbox"
                    checked={isActive}
                    onChange={() => setIsActive(!isActive)}
                    className="accent-teal-600 w-4 h-4"
                />
                <label
                    htmlFor="isActive"
                    className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                    Aktif
                </label>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 text-white rounded-lg font-semibold transition ${
                    isLoading
                        ? "bg-teal-400 cursor-not-allowed"
                        : "bg-teal-600 hover:bg-teal-700"
                }`}
            >
                {isLoading ? "Menyimpan..." : "Simpan Model"}
            </button>
        </form>
    );
};

export default CreateModelForm;