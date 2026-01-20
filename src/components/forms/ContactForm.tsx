import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { CANADIAN_CITIES } from '@/data/canadian-cities';
import { GlowInput } from '@/components/ui/GlowInput';
import { PROVINCES_STATES } from '@/constants/locations';

export const contactSchema = z.object({
    fullName: z.string().min(1, 'Full Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 'Invalid Canadian phone number (e.g. 647-555-0199)'),
    city: z.string().min(1, 'City is required'),
    province: z.string().min(1, 'Province is required'),
    linkedin: z.string().optional(),
    website: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
    form: UseFormReturn<ContactFormData>;
    className?: string;
    children?: React.ReactNode;
}

export function ContactForm({ form, className, children }: ContactFormProps) {
    const { register, formState: { errors }, setValue, watch } = form;
    const watchedValues = watch();

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 10) val = val.substring(0, 10);
        let formatted = val;
        if (val.length > 6) {
            formatted = `(${val.substring(0, 3)}) ${val.substring(3, 6)}-${val.substring(6)}`;
        } else if (val.length > 3) {
            formatted = `(${val.substring(0, 3)}) ${val.substring(3)}`;
        } else if (val.length > 0) {
            formatted = `(${val}`;
        }
        setValue('phone', formatted);
    };

    const provinces = PROVINCES_STATES['Canada']; // Default to Canada for Contact Form as per resume typically

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="grid md:grid-cols-2 gap-6">
                <GlowInput
                    id="fullName"
                    label="Full Name"
                    {...register('fullName')}
                    error={errors.fullName?.message}
                    placeholder="e.g. Jordan Smith"
                />
                <GlowInput
                    id="email"
                    label="Email"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    placeholder="jordan@example.ca"
                />
                <GlowInput
                    id="phone"
                    label="Phone (Canadian)"
                    placeholder="(647) 555-0123"
                    {...register('phone', {
                        onChange: handlePhoneChange
                    })}
                    error={errors.phone?.message}
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200 ml-1">Province</label>
                        <div className="relative group">
                            <select
                                {...register('province')}
                                className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 focus:ring-2 focus:ring-primary-500/50 outline-none appearance-none cursor-pointer transition-all hover:border-primary-500 text-slate-100"
                            >
                                <option value="">Select...</option>
                                {provinces.map(prov => (
                                    <option key={prov} value={prov}>{prov}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                        {errors.province && <p className="text-red-500 text-sm ml-1">{errors.province.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200 ml-1">City</label>
                        <div className="relative group">
                            <select
                                {...register('city')}
                                className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 focus:ring-2 focus:ring-primary-500/50 outline-none appearance-none cursor-pointer transition-all hover:border-primary-500 text-slate-100 disabled:opacity-50"
                                disabled={!watchedValues.province}
                            >
                                <option value="">Select...</option>
                                {watchedValues.province && CANADIAN_CITIES[watchedValues.province]?.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                        {errors.city && <p className="text-red-500 text-sm ml-1">{errors.city.message}</p>}
                    </div>
                </div>

                <GlowInput
                    id="linkedin"
                    label="LinkedIn URL (Optional)"
                    {...register('linkedin')}
                    placeholder="linkedin.com/in/jordan-smith"
                />
                <GlowInput
                    id="website"
                    label="Portfolio/Website (Optional)"
                    {...register('website')}
                    placeholder="jordansmith.ca"
                />
            </div>
            {children}
        </div>
    );
}
