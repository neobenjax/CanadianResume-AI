import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfile } from '@/hooks/use-profile';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { GlowInput } from '@/components/ui/GlowInput';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

// Helper for UUID
const generateId = () => Math.random().toString(36).substring(2, 9);

const educationItemSchema = z.object({
    id: z.string(),
    degree: z.string().min(1, 'Degree is required'),
    institution: z.string().min(1, 'Institution is required'),
    location: z.string().min(1, 'Location is required'),
    startDate: z.string().min(1, 'Required'),
    endDate: z.string().min(1, 'Required'), // Usually required for education
});

const formSchema = z.object({
    education: z.array(educationItemSchema),
});

type FormData = z.infer<typeof formSchema>;

export function EducationStep({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
    const { profile, updateSection, isLoading } = useProfile();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            education: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "education"
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

    return (
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
                {fields.map((field, index) => (
                    <GlassCard key={field.id} className="relative group">
                        <div className="absolute top-4 right-4">
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <h3 className="text-lg font-semibold text-primary-700 mb-4">Education {index + 1}</h3>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <GlowInput label="Degree / Diploma" {...form.register(`education.${index}.degree`)} placeholder="B.Sc. Computer Science" error={form.formState.errors.education?.[index]?.degree?.message} />
                            <GlowInput label="Institution" {...form.register(`education.${index}.institution`)} placeholder="University of Toronto" error={form.formState.errors.education?.[index]?.institution?.message} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <GlowInput label="City" {...form.register(`education.${index}.location`)} placeholder="Toronto, ON" />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 ml-1">Start Date</label>
                                <input type="month" {...form.register(`education.${index}.startDate`)} className="w-full px-4 py-3 bg-white/50 rounded-xl border border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 ml-1">End Date (or Expected)</label>
                                <input type="month" {...form.register(`education.${index}.endDate`)} className="w-full px-4 py-3 bg-white/50 rounded-xl border border-slate-200" />
                            </div>
                        </div>
                    </GlassCard>
                ))}

                <button
                    type="button"
                    onClick={() => append({ id: generateId(), degree: '', institution: '', location: '', startDate: '', endDate: '' })}
                    className="w-full py-4 border-2 border-dashed border-primary-200 rounded-xl text-primary-600 font-medium hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add Education
                </button>
            </div>

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
