import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfile } from '@/hooks/use-profile';
import { useEffect, useState } from 'react';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { VolunteeringForm, volunteeringFormSchema, VolunteeringFormData } from '@/components/forms/VolunteeringForm';

export function VolunteeringStep({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
    const { profile, updateSection, isLoading } = useProfile();

    const form = useForm<VolunteeringFormData>({
        resolver: zodResolver(volunteeringFormSchema),
        defaultValues: {
            volunteering: []
        }
    });

    // Load initial data
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (profile?.volunteering && !loaded) {
            const mapped = profile.volunteering.map(item => ({
                ...item,
                achievements: item.achievements || []
            }));
            form.reset({ volunteering: mapped });
            setLoaded(true);
        } else if (profile && !profile.volunteering && !loaded) {
            // Handle case where volunteering array might be undefined in old profiles
            form.reset({ volunteering: [] });
            setLoaded(true);
        }
    }, [profile, form, loaded]);

    const saveDraft = async () => {
        const currentData = form.getValues();
        const toSave = currentData.volunteering?.map(item => ({
            ...item,
            province: item.province || '',
            country: item.country || 'Canada',
            achievements: item.achievements?.filter(a => a.trim()) || []
        })) || [];
        await updateSection('volunteering', toSave);
    };

    const handleBack = async () => {
        await saveDraft();
        onBack();
    };

    const onSubmit = async (data: VolunteeringFormData) => {
        const toSave = data.volunteering?.map(item => ({
            ...item,
            province: item.province || '',
            country: item.country || 'Canada',
            achievements: item.achievements?.filter(a => a.trim()) || []
        }));
        await updateSection('volunteering', toSave);
        onNext();
    };

    if (isLoading) return <div className="p-12 text-center text-slate-400">Loading your profile...</div>;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <VolunteeringForm form={form} />

            <div className="flex justify-between pt-6">
                <NorthernButton type="button" variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </NorthernButton>
                <NorthernButton type="submit" className="shadow-glow-primary">
                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                </NorthernButton>
            </div>
        </form>
    )
}
