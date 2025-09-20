import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';

export default function MateriListPage() {
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <PageMeta
                title="Buat Materi"
                description="Lihat semua materi pokok yang telah dibuat."
            />
            <PageBreadcrumb pageTitle="Buat Materi" />
        </div>
    );
}