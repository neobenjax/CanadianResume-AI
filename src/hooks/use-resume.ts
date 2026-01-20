import { useLiveQuery } from 'dexie-react-hooks';
import { db, Resume } from '@/lib/db';

export function useResume(id: number) {
    const resume = useLiveQuery(() => db.resumes.get(id), [id]);

    const updateResumeContent = async (content: any) => {
        if (!id) return;
        await db.resumes.update(id, {
            generatedContent: content,
            updatedAt: new Date()
        });
    };

    const updateTitle = async (title: string) => {
        if (!id) return;
        await db.resumes.update(id, {
            title,
            updatedAt: new Date()
        });
    };

    return {
        resume,
        isLoading: !resume,
        updateResumeContent,
        updateTitle
    };
}
