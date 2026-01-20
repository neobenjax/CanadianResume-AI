import { useLiveQuery } from 'dexie-react-hooks';
import { db, Resume } from '@/lib/db';

export function useResumes() {
    const resumes = useLiveQuery(() => db.resumes.orderBy('updatedAt').reverse().toArray());

    const createResumeFromProfile = async (title: string, profileSnapshot: any) => {
        const id = await db.resumes.add({
            title,
            generatedContent: profileSnapshot, // Snapshot of the profile at this time
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return id;
    };

    const deleteResume = async (id: number) => {
        await db.resumes.delete(id);
    };

    const updateResume = async (id: number, data: Partial<Resume>) => {
        await db.resumes.update(id, {
            ...data,
            updatedAt: new Date()
        });
    };

    return { resumes, createResumeFromProfile, deleteResume, updateResume };
}
