import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfile } from '@/hooks/use-profile';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { CANADIAN_CITIES } from '@/data/canadian-cities';
import { GlowInput } from '@/components/ui/GlowInput';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { ArrowRight } from 'lucide-react';

const contactSchema = z.object({
    fullName: z.string().min(1, 'Full Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 'Invalid Canadian phone number (e.g. 647-555-0199)'),
    city: z.string().min(1, 'City is required'),
    province: z.string().min(1, 'Province is required'),
    linkedin: z.string().optional(),
    website: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

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
            // Save draft even if invalid, but simple merge
            updateContact(debouncedValues);
        }
    }, [debouncedValues, updateContact, isLoading, profile]);

    const onSubmit = (data: ContactFormData) => {
        onNext();
    };

    if (isLoading) return <div className="p-12 text-center text-slate-400">Loading your profile...</div>;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-6">
                <GlowInput
                    id="fullName"
                    label="Full Name"
                    {...form.register('fullName')}
                    error={form.formState.errors.fullName?.message}
                    placeholder="e.g. Jordan Smith"
                />
                <GlowInput
                    id="email"
                    label="Email"
                    type="email"
                    {...form.register('email')}
                    error={form.formState.errors.email?.message}
                    placeholder="jordan@example.ca"
                />
                <GlowInput
                    id="phone"
                    label="Phone (Canadian)"
                    placeholder="(647) 555-0123"
                    {...form.register('phone', {
                        onChange: (e) => {
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
                            form.setValue('phone', formatted);
                        }
                    })}
                    error={form.formState.errors.phone?.message}
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200 ml-1">Province</label>
                        <div className="relative group">
                            <select
                                {...form.register('province')}
                                className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 focus:ring-2 focus:ring-primary-500/50 outline-none appearance-none cursor-pointer transition-all hover:border-primary-500 text-slate-100"
                            >
                                <option value="">Select...</option>
                                <option value="ON">Ontario</option>
                                <option value="BC">British Columbia</option>
                                <option value="AB">Alberta</option>
                                <option value="QC">Quebec</option>
                                <option value="MB">Manitoba</option>
                                <option value="SK">Saskatchewan</option>
                                <option value="NS">Nova Scotia</option>
                                <option value="NB">New Brunswick</option>
                                <option value="NL">Newfoundland & Labrador</option>
                                <option value="PE">Prince Edward Island</option>
                                <option value="YT">Yukon</option>
                                <option value="NT">Northwest Territories</option>
                                <option value="NU">Nunavut</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                        {form.formState.errors.province && <p className="text-red-500 text-sm ml-1">{form.formState.errors.province.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200 ml-1">City</label>
                        <div className="relative group">
                            <select
                                {...form.register('city')}
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
                        {form.formState.errors.city && <p className="text-red-500 text-sm ml-1">{form.formState.errors.city.message}</p>}
                    </div>
                </div>

                <GlowInput
                    id="linkedin"
                    label="LinkedIn URL (Optional)"
                    {...form.register('linkedin')}
                    placeholder="linkedin.com/in/jordan-smith"
                />
                <GlowInput
                    id="website"
                    label="Portfolio/Website (Optional)"
                    {...form.register('website')}
                    placeholder="jordansmith.ca"
                />
            </div>

            <div className="flex justify-end pt-6">
                <NorthernButton type="submit" className="w-full md:w-auto shadow-glow-primary">
                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                </NorthernButton>
            </div>
        </form>
    )
}
