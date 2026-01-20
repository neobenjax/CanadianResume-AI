import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { GlowInput } from '@/components/ui/GlowInput';
import { Plus, Trash2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export const educationItemSchema = z.object({
    id: z.string(),
    degree: z.string().min(1, 'Degree is required'),
    institution: z.string().min(1, 'Institution is required'),
    location: z.string().min(1, 'Location is required'),
    startDate: z.string().min(1, 'Required'),
    endDate: z.string().min(1, 'Required'),
});

export const educationFormSchema = z.object({
    education: z.array(educationItemSchema),
});

export type EducationFormData = z.infer<typeof educationFormSchema>;

const generateId = () => Math.random().toString(36).substring(2, 9);

interface EducationFormProps {
    form: UseFormReturn<EducationFormData>;
    className?: string;
}

export function EducationForm({ form, className }: EducationFormProps) {
    const { register, control, formState: { errors } } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "education"
    });

    return (
        <div className={`space-y-6 ${className}`}>
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

                        <h3 className="text-lg font-semibold text-primary-300 mb-4">Education {index + 1}</h3>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <GlowInput
                                label="Degree / Diploma"
                                {...register(`education.${index}.degree`)}
                                placeholder="B.Sc. Computer Science"
                                error={errors.education?.[index]?.degree?.message}
                                textClassName="text-slate-100"
                            />
                            <GlowInput
                                label="Institution"
                                {...register(`education.${index}.institution`)}
                                placeholder="University of Toronto"
                                error={errors.education?.[index]?.institution?.message}
                                textClassName="text-slate-100"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <GlowInput
                                label="City"
                                {...register(`education.${index}.location`)}
                                placeholder="Toronto, ON"
                                textClassName="text-slate-100"
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-200 ml-1">Start Date</label>
                                <input
                                    type="month"
                                    {...register(`education.${index}.startDate`)}
                                    className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 focus:ring-2 focus:ring-primary-500/50 outline-none text-slate-100 [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-200 ml-1">End Date (or Expected)</label>
                                <input
                                    type="month"
                                    {...register(`education.${index}.endDate`)}
                                    className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 focus:ring-2 focus:ring-primary-500/50 outline-none text-slate-100 [color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </GlassCard>
                ))}

                <button
                    type="button"
                    onClick={() => append({ id: generateId(), degree: '', institution: '', location: '', startDate: '', endDate: '' })}
                    className="w-full py-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 font-medium hover:bg-slate-800/50 hover:text-primary-400 hover:border-primary-500/50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add Education
                </button>
            </div>
        </div>
    );
}
