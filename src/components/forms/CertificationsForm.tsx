import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { GlowInput } from '@/components/ui/GlowInput';
import { Plus, Trash2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export const certificationItemSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Certification Name is required'),
    issuer: z.string().min(1, 'Issuer is required'),
    date: z.string().min(1, 'Date is required'),
    expiryDate: z.string().optional(),
});

export const certificationsFormSchema = z.object({
    certifications: z.array(certificationItemSchema),
});

export type CertificationsFormData = z.infer<typeof certificationsFormSchema>;

const generateId = () => Math.random().toString(36).substring(2, 9);

interface CertificationsFormProps {
    form: UseFormReturn<CertificationsFormData>;
    className?: string;
}

export function CertificationsForm({ form, className }: CertificationsFormProps) {
    const { register, control, formState: { errors } } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "certifications"
    });

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="space-y-6">
                {fields.map((field, index) => (
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

                        <h3 className="text-lg font-semibold text-primary-300 mb-6">Certification {index + 1}</h3>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <GlowInput
                                label="Certification Name"
                                {...register(`certifications.${index}.name`)}
                                error={errors.certifications?.[index]?.name?.message}
                                textClassName="text-slate-100"
                                placeholder="e.g. AWS Certified Solutions Architect"
                            />
                            <GlowInput
                                label="Issuing Organization"
                                {...register(`certifications.${index}.issuer`)}
                                error={errors.certifications?.[index]?.issuer?.message}
                                textClassName="text-slate-100"
                                placeholder="e.g. Amazon Web Services"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-200 ml-1">Date Issued</label>
                                <input
                                    type="month"
                                    {...register(`certifications.${index}.date`)}
                                    className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 focus:ring-2 focus:ring-primary-500/50 outline-none text-slate-100 [color-scheme:dark]"
                                />
                                {errors.certifications?.[index]?.date?.message && (
                                    <p className="text-red-400 text-xs ml-1">{errors.certifications?.[index]?.date?.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-200 ml-1">Expiry Date (Optional)</label>
                                <input
                                    type="month"
                                    {...register(`certifications.${index}.expiryDate`)}
                                    className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 focus:ring-2 focus:ring-primary-500/50 outline-none text-slate-100 [color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </GlassCard>
                ))}

                <button
                    type="button"
                    onClick={() => append({
                        id: generateId(),
                        name: '',
                        issuer: '',
                        date: '',
                        expiryDate: ''
                    })}
                    className="w-full py-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 font-medium hover:bg-slate-800/50 hover:text-primary-400 hover:border-primary-500/50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add Certification
                </button>
            </div>
        </div>
    );
}
