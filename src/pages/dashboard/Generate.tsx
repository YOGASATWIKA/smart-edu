// import { useState } from 'react';
// import PageBreadcrumb from '../../components/common/PageBreadCrumb.tsx';
// import PageMeta from '../../components/common/PageMeta.tsx';
// import MateriPokokModal from '../../components/materiPokokForm.tsx';
// import { useOutline } from '../../hooks/useOutline.tsx';
// import OutlineForm from '../../components/outline/outlineForm.tsx';
// import OutlineDisplay from '../../components/outline/outlineDisplay.tsx';
//
// export default function OutlineGenerator() {
//     const { states, handlers } = useOutline();
//     const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//
//     if (states.initialLoading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <p className="text-lg text-gray-500">Memuat data konfigurasi...</p>
//             </div>
//         );
//     }
//
//     if (states.initialError) {
//         return (
//             <div className="flex justify-center items-center h-screen bg-red-50">
//                 <p className="text-lg text-red-600">Terjadi kesalahan: {states.initialError}</p>
//             </div>
//         );
//     }
//
//     return (
//         <div className="p-4 md:p-6 lg:p-8">
//             <PageMeta title="Outline Generator" description="Generate outline materi seleksi SKB-CPNS." />
//             <PageBreadcrumb pageTitle="Outline Generator" />
//
//             <div className="flex flex-col gap-8 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:flex-row xl:p-8">
//                 <div className="flex-1">
//                     <OutlineForm
//                         // Props yang sudah ada
//                         onMateriSelectClick={() => setIsModalOpen(true)}
//                         selectedMateri={states.selectedMateri}
//                         modelList={states.modelList}
//                         selectedModel={states.selectedModel}
//                         onModelChange={handlers.setSelectedModel}
//                         isGenerating={states.isGenerating}
//                         isSaving={states.isSaving}
//                         isDirty={states.isDirty}
//                         outlineStatus={states.outlineStatus} // Kirim status outline
//                         onGenerateClick={handlers.handleGenerate} // Kirim handler generate
//                         onSaveClick={handlers.handleSave}       // Kirim handler save
//                     />
//                     {/* ------------------------- */}
//
//                     <OutlineDisplay
//                         status={states.outlineStatus}
//                         isGenerating={states.isGenerating}
//                         error={states.generationError}
//                         htmlContent={states.outlineHtmlContent}
//                         onEditorChange={handlers.handleEditorChange}
//                     />
//                 </div>
//             </div>
//
//             {isModalOpen && (
//                 <MateriPokokModal
//                     materiList={states.materiList}
//                     onClose={() => setIsModalOpen(false)}
//                     onSelectMateri={(materi) => {
//                         handlers.handleSelectMateri(materi);
//                         setIsModalOpen(false);
//                     }}
//                 />
//             )}
//         </div>
//     );
// }