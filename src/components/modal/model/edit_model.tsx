import React, { useState } from "react";
import { updateModel, Promt, Model } from "../../../services/model/modelService.tsx";
import Swal from "sweetalert2";
import { Plus, Trash } from "lucide-react";

interface EditModelFormProps {
    modelData: Model;
    onSuccess: () => void;
    onCancel: () => void;
}

const EditModelForm: React.FC<EditModelFormProps> = ({ modelData, onSuccess, onCancel }) => {
    const [model, setModel] = useState(modelData.model || "");
    const [description, setDescription] = useState(modelData.description || "");
    const [isActive, setIsActive] = useState(modelData.is_active || false);
    const [isLoading, setIsLoading] = useState(false);
    const [variables] = useState<string[]>(modelData.variables || []);
    const [steps, setSteps] = useState<Promt[]>(modelData.steps || [{ role: "system", content: "" }]);

    const handleAddStep = () => setSteps([...steps, { role: "human", content: "" }]);
    const handleRemoveStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));
    const handleChangeStep = (index: number, field: keyof Promt, value: string) => {
        const updated = [...steps];
        updated[index][field] = value;
        setSteps(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const payload = { model, description, steps, variables, is_active: isActive };
            const res = await updateModel(modelData.id, payload);
            Swal.fire("Berhasil", res.message || "Model berhasil diperbarui!", "success");
            onSuccess();
        } catch (err: any) {
            Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan saat update model.", "error");
        } finally {
            setIsLoading(false);
            window.location.reload();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-lg space-y-4 text-gray-900 dark:text-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Edit Model</h2>

            <div>
                <label className="block text-sm font-medium mb-1">Nama Model</label>
                <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800  dark:border-gray-700 "
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                    rows={1}
                />
            </div>

            <div>
                {steps.map((step, i) => (
                    <div key={i} className="border rounded-lg p-3 mb-2 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                            <select
                                value={step.role}
                                onChange={(e) => handleChangeStep(i, "role", e.target.value)}
                                className="border rounded px-2 py-1 text-sm bg-white dark:bg-gray-800  dark:border-gray-700"
                            >
                                <option value="system">System</option>
                                <option value="human">Human</option>
                            </select>
                            {steps.length > 1 && (
                                <button type="button" onClick={() => handleRemoveStep(i)} className="text-red-500 hover:text-red-700">
                                    <Trash size={16} />
                                </button>
                            )}
                        </div>
                        <textarea
                            value={step.content}
                            onChange={(e) => handleChangeStep(i, "content", e.target.value)}
                            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800  dark:border-gray-700"
                            rows={10}
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddStep}
                    className="text-teal-600 text-sm flex items-center gap-1 font-medium"
                >
                    <Plus size={16} /> Tambah Step
                </button>
            </div>

            <div className="flex items-center gap-2">
                <input id="isActive" type="checkbox" checked={isActive} onChange={() => setIsActive(!isActive)} />
                <label htmlFor="isActive" className="text-sm">Aktif</label>
            </div>

            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg">Batal</button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-4 py-2 text-sm text-white rounded-lg ${isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                    {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
            </div>
        </form>
    );
};

export default EditModelForm;
