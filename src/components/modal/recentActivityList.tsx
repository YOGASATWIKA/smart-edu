import {useState, useEffect, JSX} from 'react';
import { getActivity } from '../../services/modul/modulService.tsx';
import { ModulActivity } from '../../services/modul/modulService.tsx'

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const stateConfig: { [key: string]: { color: string; icon: JSX.Element } } = {
    DRAFT: {
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>,
    },
    OUTLINE: {
        color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>,
    },
    EBOOK: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>,
    },
    DELETED: {
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
    }
};

export default function ActivityTimeline() {
    const [activities, setActivities] = useState<ModulActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadActivities = async () => {
            try {
                setIsLoading(true);
                const data = await getActivity();
                const sortedData = data.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
                setActivities(sortedData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadActivities();
    }, []);

    const renderContent = () => {
        if (isLoading) return <p className="text-center text-gray-500 py-8">Memuat Aktivitas Terakhir</p>;
        if (error) return <p className="text-center text-red-500 py-8">Error: {error}</p>;
        if (activities.length === 0) return <p className="text-center text-gray-500 py-8">Belum Ada Aktivitas</p>;

        return (
            <ol className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-6">
                {activities.map((activity, index) => {
                    const config = stateConfig[activity.state] || stateConfig.DRAFT;
                    return (
                        <li key={activity._id} className={`mb-10 ml-10 ${index === activities.length - 1 ? 'mb-0' : ''}`}>
                          <span className={`absolute -left-5 flex h-9 w-9 items-center justify-center rounded-full ring-8 ring-white dark:ring-gray-900 ${config.color}`}>
                            {config.icon}
                          </span>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{activity.nama_jabatan}</h3>
                                <time className="block sm:hidden mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{formatDate(activity.updated_at)}</time>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${config.color}`}>{activity.state}</span>
                            </div>
                            <time className="hidden sm:block mt-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{formatDate(activity.updated_at)}</time>
                        </li>
                    );
                })}
            </ol>
        );
    };

    return (
        <section>
                {renderContent()}
        </section>
    );
}