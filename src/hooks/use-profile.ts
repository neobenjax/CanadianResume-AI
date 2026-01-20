import { useLiveQuery } from 'dexie-react-hooks';
import { db, UserProfile, initProfile, PROFILE_ID } from '@/lib/db';
import { useEffect, useState } from 'react';

export function useProfile() {
    // We explicitly query for key 1, assuming initProfile ensures it
    const profile = useLiveQuery(() => db.user_profile.get(PROFILE_ID));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        initProfile().then(() => setIsLoading(false));
    }, []);

    const updateContact = async (data: Partial<UserProfile['contact']>) => {
        if (!profile?.id) return;
        await db.user_profile.update(profile.id, {
            contact: { ...profile.contact, ...data },
            updatedAt: new Date(),
        });
    };

    const updateSection = async (key: keyof UserProfile, data: any) => {
        if (!profile?.id) return;
        await db.user_profile.update(profile.id, {
            [key]: data,
            updatedAt: new Date(),
        });
    }

    return {
        profile,
        isLoading: isLoading || !profile,
        updateContact,
        updateSection
    };
}
