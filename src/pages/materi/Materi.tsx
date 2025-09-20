import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';

export default function MateriListPage() {
    return (
        <>
            <PageMeta
                title="Ebook"
                description="Lihat semua materi pokok yang telah dibuat."
            />
            <PageBreadcrumb pageTitle="Ebook" />
        </>
    );
}