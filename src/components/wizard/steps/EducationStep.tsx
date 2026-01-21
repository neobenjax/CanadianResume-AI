import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfile } from '@/hooks/use-profile';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { EducationForm, educationFormSchema, EducationFormData } from '@/components/forms/EducationForm';

export function EducationStep({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
    const { profile, updateSection, isLoading } = useProfile();

    const form = useForm<EducationFormData>({
        resolver: zodResolver(educationFormSchema),
        defaultValues: {
            education: []
        }
    });

    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (profile?.education && !loaded) {
            form.reset({ education: profile.education });
            setLoaded(true);
        }
    }, [profile, form, loaded]);

    const watchedValues = form.watch();
    const debouncedValues = useDebounce(watchedValues, 1000);

    useEffect(() => {
        if (!isLoading && profile) {
            updateSection('education', debouncedValues.education);
        }
    }, [debouncedValues, updateSection, isLoading, profile]);

    const onSubmit = async (data: EducationFormData) => {
        await updateSection('education', data.education);
        onNext();
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <EducationForm form={form} />

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
