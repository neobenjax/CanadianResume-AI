import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfile } from '@/hooks/use-profile';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { GlowInput } from '@/components/ui/GlowInput';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { ArrowLeft, ArrowRight, Plus, Trash2, X } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CANADIAN_CITIES } from '@/data/canadian-cities';
import { cn } from '@/lib/utils';

// Helper for local UUID
const generateId = () => Math.random().toString(36).substring(2, 9);

const experienceItemSchema = z.object({
    id: z.string(),
    role: z.string().min(1, 'Role is required'),
    company: z.string().min(1, 'Company is required'),
    country: z.string().min(1, 'Country is required'),
    province: z.string(),
    city: z.string().min(1, 'City is required'),
    startDate: z.string().min(1, 'Required'),
    endDate: z.string().optional(),
    isCurrent: z.boolean(),
    achievements: z.array(z.string()),
});

const formSchema = z.object({
    experience: z.array(experienceItemSchema),
});

type FormData = z.infer<typeof formSchema>;

export function ExperienceStep({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
    const { profile, updateSection, isLoading } = useProfile();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            experience: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "experience"
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

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
                {fields.map((field, index) => {
                    // Nested logic for achievements
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const achievements = watchedValues.experience?.[index]?.achievements || [];

                    const addAchievement = () => {
                        const current = form.getValues(`experience.${index}.achievements`) || [];
                        form.setValue(`experience.${index}.achievements`, [...current, '']);
                    };

                    const removeAchievement = (aIndex: number) => {
                        const current = form.getValues(`experience.${index}.achievements`) || [];
                        const updated = current.filter((_, i) => i !== aIndex);
                        form.setValue(`experience.${index}.achievements`, updated);
                    };

                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const country = watchedValues.experience?.[index]?.country;

                    return (
                        <GlassCard key={field.id} className="relative group">
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <h3 className="text-lg font-semibold text-primary-300 mb-6">Position {index + 1}</h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <GlowInput
                                    label="Role / Job Title"
                                    {...form.register(`experience.${index}.role`)}
                                    error={form.formState.errors.experience?.[index]?.role?.message}
                                    textClassName="text-slate-100"
                                />
                                <GlowInput
                                    label="Company"
                                    {...form.register(`experience.${index}.company`)}
                                    error={form.formState.errors.experience?.[index]?.company?.message}
                                    textClassName="text-slate-100"
                                />
                            </div>

                            {/* Location Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-200 ml-1">Country</label>
                                    <div className="relative">
                                        <select
                                            {...form.register(`experience.${index}.country`)}
                                            className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 focus:ring-2 focus:ring-primary-500/50 outline-none appearance-none cursor-pointer transition-all hover:border-primary-500 text-slate-100 placeholder:text-slate-500"
                                        >
                                            <option value="Canada">Canada</option>
                                            <option value="USA">USA</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                {country === 'Canada' ? (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-200 ml-1">Province</label>
                                        <div className="relative">
                                            <select
                                                {...form.register(`experience.${index}.province`)}
                                                className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 focus:ring-2 focus:ring-primary-500/50 outline-none appearance-none cursor-pointer transition-all hover:border-primary-500 text-slate-100 placeholder:text-slate-500"
                                            >
                                                <option value="">Select...</option>
                                                {Object.keys(CANADIAN_CITIES).map(prov => (
                                                    <option key={prov} value={prov}>{prov}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <GlowInput
                                        label="State/Region"
                                        {...form.register(`experience.${index}.province`)}
                                        textClassName="text-slate-100"
                                    />
                                )}

                                <GlowInput
                                    label="City"
                                    {...form.register(`experience.${index}.city`)}
                                    textClassName="text-slate-100"
                                />
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-200 ml-1">Start Date</label>
                                    <input
                                        type="month"
                                        {...form.register(`experience.${index}.startDate`)}
                                        className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 focus:ring-2 focus:ring-primary-500/50 outline-none text-slate-100 [color-scheme:dark]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-200 ml-1">End Date</label>
                                    <input
                                        type="month"
                                        {...form.register(`experience.${index}.endDate`)}
                                        className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 focus:ring-2 focus:ring-primary-500/50 outline-none text-slate-100 [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-200 ml-1">
                                    Key Achievements (STAR Method)
                                </label>
                                <p className="text-xs text-slate-400 ml-1">
                                    STAR: Situation, Task, Action, Result. e.g., "Increased sales by 20% by implementing a new CRM system."
                                </p>

                                <div className="space-y-2">
                                    {achievements.map((_, aIndex) => (
                                        <div key={aIndex} className="flex gap-2 items-start">
                                            <GlowInput
                                                {...form.register(`experience.${index}.achievements.${aIndex}`)}
                                                placeholder={`Achievement ${aIndex + 1}`}
                                                className="flex-1"
                                                textClassName="text-slate-100"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeAchievement(aIndex)}
                                                className="mt-3 p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addAchievement}
                                        className="text-sm text-primary-400 hover:text-primary-300 font-medium ml-1 flex items-center gap-1 mt-2"
                                    >
                                        <Plus className="w-3 h-3" /> Add Achievement
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    )
                })}

                <button
                    type="button"
                    onClick={() => append({
                        id: generateId(),
                        role: '',
                        company: '',
                        city: '',
                        province: '',
                        country: 'Canada',
                        startDate: '',
                        endDate: '',
                        isCurrent: false,
                        achievements: [''] // Start with one empty slot
                    })}
                    className="w-full py-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 font-medium hover:bg-slate-800/50 hover:text-primary-400 hover:border-primary-500/50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add Experience
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
