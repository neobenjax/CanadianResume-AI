import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfile } from '@/hooks/use-profile';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ExperienceForm, experienceFormSchema, ExperienceFormData } from '@/components/forms/ExperienceForm';

export function ExperienceStep({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
    const { profile, updateSection, isLoading } = useProfile();

    const form = useForm<ExperienceFormData>({
        resolver: zodResolver(experienceFormSchema),
        defaultValues: {
            experience: []
        }
    });

    // Load initial data
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (profile?.experience && !loaded) {
            const mapped = profile.experience.map(item => ({
                ...item,
                achievements: item.achievements || []
            }));
            form.reset({ experience: mapped });
            setLoaded(true);
        }
    }, [profile, form, loaded]);

    // Debounced Auto-save
    const watchedValues = form.watch();
    const debouncedValues = useDebounce(watchedValues, 1000);

    useEffect(() => {
        if (!isLoading && profile && loaded) {
            // Clean empty achievements before saving
            const toSave = debouncedValues.experience?.map(item => ({
                ...item,
                // Ensure required DB fields are strings
                province: item.province || '',
                country: item.country || 'Canada',
                achievements: item.achievements?.filter(a => a.trim()) || []
            }));
            updateSection('experience', toSave);
        }
    }, [debouncedValues, updateSection, isLoading, profile, loaded]);

    const onSubmit = () => {
        onNext();
    };

    if (isLoading) return <div className="p-12 text-center text-slate-400">Loading your profile...</div>;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ExperienceForm form={form} />

            <div className="flex justify-between pt-6">
                <NorthernButton type="button" variant="ghost" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </NorthernButton>
                <NorthernButton type="submit" className="shadow-glow-primary">
                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                </NorthernButton>
            </div>
        </form>
    )
}
