import {useEffect, useRef, useId, useState} from "react";
import {Model} from "../../../services/model/modelService.tsx";
import EditModelForm from "./edit_model.tsx";

interface ModelDetailModalProps {
    model: Model | null,
    onClose: () => void,
    details?: string[]
}

const ModelDetailModal = ({model, onClose}: ModelDetailModalProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const titleId = useId();
    const descriptionId = useId();
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!model) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
             onClick={onClose}>
            <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl mx-4 p-6 relative overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
            >
                {isEditing ? (
                    <EditModelForm
                        modelData={model}
                        onSuccess={() => {
                            setIsEditing(false);
                            onClose();
                        }}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <>
                        <h2 id={titleId} className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                            <span className="text-teal-600">{model.model}</span>
                        </h2>
                        <p id={descriptionId} className="text-sm mb-4 text-gray-700 dark:text-gray-300">{model.description}</p>

                        <div>
                            {model.steps?.map((step, i) => (
                                <div key={i} className="border rounded-lg p-3 mb-2 dark:border-gray-700">
                                    <div className="flex justify-between mb-1 text-sm">
                                        <span className="text-teal-600">{step.role}</span>
                                        <span className="text-gray-500">Step {i + 1}</span>
                                    </div>
                                    <p className="text-sm whitespace-pre-line text-gray-700 dark:text-gray-300">{step.content}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                ref={closeButtonRef}
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            >
                                Edit
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ModelDetailModal;
