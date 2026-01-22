import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfile } from '@/hooks/use-profile';
import { useEffect, useState } from 'react';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CertificationsForm, certificationsFormSchema, CertificationsFormData } from '@/components/forms/CertificationsForm';

export function CertificationsStep({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
    const { profile, updateSection, isLoading } = useProfile();

    const form = useForm<CertificationsFormData>({
        resolver: zodResolver(certificationsFormSchema),
        defaultValues: {
            certifications: []
        }
    });

    // Load initial data
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (profile?.certifications && !loaded) {
            form.reset({ certifications: profile.certifications });
            setLoaded(true);
        } else if (profile && !profile.certifications && !loaded) {
            form.reset({ certifications: [] });
            setLoaded(true);
        }
    }, [profile, form, loaded]);

    const saveDraft = async () => {
        const currentData = form.getValues();
        await updateSection('certifications', currentData.certifications);
    };

    const handleBack = async () => {
        await saveDraft();
        onBack();
    };

    const onSubmit = async (data: CertificationsFormData) => {
        await updateSection('certifications', data.certifications);
        onNext();
    };

    if (isLoading) return <div className="p-12 text-center text-slate-400">Loading your profile...</div>;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CertificationsForm form={form} />

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
