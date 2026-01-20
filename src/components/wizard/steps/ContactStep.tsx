import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfile } from '@/hooks/use-profile';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { ArrowRight } from 'lucide-react';
import { ContactForm, contactSchema, ContactFormData } from '@/components/forms/ContactForm';

export function ContactStep({ onNext }: { onNext: () => void }) {
    const { profile, updateContact, isLoading } = useProfile();

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            fullName: '', email: '', phone: '', city: '', province: '', linkedin: '', website: ''
        }
    });

    // Load initial data
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (profile?.contact && !loaded) {
            form.reset(profile.contact);
            setLoaded(true);
        }
    }, [profile, form, loaded]);

    // Debounced Auto-save
    const watchedValues = form.watch();
    const debouncedValues = useDebounce(watchedValues, 1000);

    useEffect(() => {
        if (!isLoading && profile) {
            updateContact(debouncedValues);
        }
    }, [debouncedValues, updateContact, isLoading, profile]);

    const onSubmit = (data: ContactFormData) => {
        onNext();
    };

    if (isLoading) return <div className="p-12 text-center text-slate-400">Loading your profile...</div>;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ContactForm form={form}>
                <div className="flex justify-end pt-6">
                    <NorthernButton type="submit" className="w-full md:w-auto shadow-glow-primary">
                        Next Step <ArrowRight className="w-4 h-4 ml-2" />
                    </NorthernButton>
                </div>
            </ContactForm>
        </form>
    )
}
