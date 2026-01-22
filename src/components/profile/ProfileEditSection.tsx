import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfile } from '@/hooks/use-profile';
import { Modal } from '@/components/ui/Modal';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { ContactForm, contactSchema, ContactFormData } from '@/components/forms/ContactForm';
import { ExperienceForm, experienceFormSchema, ExperienceFormData } from '@/components/forms/ExperienceForm';
import { EducationForm, educationFormSchema, EducationFormData } from '@/components/forms/EducationForm';
import { SkillsForm } from '@/components/forms/SkillsForm';
import { VolunteeringForm, volunteeringFormSchema, VolunteeringFormData } from '@/components/forms/VolunteeringForm';
import { CertificationsForm, certificationsFormSchema, CertificationsFormData } from '@/components/forms/CertificationsForm';
import { UserSkills } from '@/lib/db';

interface ProfileEditSectionProps {
    section: 'contact' | 'experience' | 'education' | 'skills' | 'volunteering' | 'certifications' | null;
    onClose: () => void;
}

export function ProfileEditSection({ section, onClose }: ProfileEditSectionProps) {
    // We conditionally render the form based on section
    return (
        <Modal
            isOpen={!!section}
            onClose={onClose}
            title={
                section === 'contact' ? 'Edit Contact Info' :
                    section === 'experience' ? 'Edit Experience' :
                        section === 'education' ? 'Edit Education' :
                            section === 'volunteering' ? 'Edit Volunteering' :
                                section === 'certifications' ? 'Edit Certifications' :
                                    'Edit Skills'
            }
        >
            {section === 'contact' && <ContactEditor onClose={onClose} />}
            {section === 'experience' && <ExperienceEditor onClose={onClose} />}
            {section === 'education' && <EducationEditor onClose={onClose} />}
            {section === 'skills' && <SkillsEditor onClose={onClose} />}
            {section === 'volunteering' && <VolunteeringEditor onClose={onClose} />}
            {section === 'certifications' && <CertificationsEditor onClose={onClose} />}
        </Modal>
    );
}

function ContactEditor({ onClose }: { onClose: () => void }) {
    const { profile, updateContact } = useProfile();
    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            fullName: '', email: '', phone: '', city: '', province: '', linkedin: '', website: ''
        }
    });

    useEffect(() => {
        if (profile?.contact) {
            form.reset(profile.contact);
        }
    }, [profile, form]);

    const onSubmit = async (data: ContactFormData) => {
        await updateContact(data);
        onClose();
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ContactForm form={form} />
            <div className="flex justify-end pt-4">
                <NorthernButton type="submit">Save Changes</NorthernButton>
            </div>
        </form>
    );
}

function ExperienceEditor({ onClose }: { onClose: () => void }) {
    const { profile, updateSection } = useProfile();
    const form = useForm<ExperienceFormData>({
        resolver: zodResolver(experienceFormSchema),
        defaultValues: { experience: [] }
    });

    useEffect(() => {
        if (profile?.experience) {
            const mapped = profile.experience.map(item => ({
                ...item,
                achievements: item.achievements || []
            }));
            form.reset({ experience: mapped });
        }
    }, [profile, form]);

    const onSubmit = async (data: ExperienceFormData) => {
        await updateSection('experience', data.experience);
        onClose();
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ExperienceForm form={form} />
            <div className="flex justify-end pt-4">
                <NorthernButton type="submit">Save Changes</NorthernButton>
            </div>
        </form>
    );
}

function EducationEditor({ onClose }: { onClose: () => void }) {
    const { profile, updateSection } = useProfile();
    const form = useForm<EducationFormData>({
        resolver: zodResolver(educationFormSchema),
        defaultValues: { education: [] }
    });

    useEffect(() => {
        if (profile?.education) {
            form.reset({ education: profile.education });
        }
    }, [profile, form]);

    const onSubmit = async (data: EducationFormData) => {
        await updateSection('education', data.education);
        onClose();
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <EducationForm form={form} />
            <div className="flex justify-end pt-4">
                <NorthernButton type="submit">Save Changes</NorthernButton>
            </div>
        </form>
    );
}

function SkillsEditor({ onClose }: { onClose: () => void }) {
    const { profile, updateSection } = useProfile();
    const [currentSkills, setCurrentSkills] = useState<UserSkills>({ technical: [], soft: [] });

    useEffect(() => {
        if (profile?.skills) {
            if (Array.isArray(profile.skills)) {
                setCurrentSkills({ technical: profile.skills, soft: [] });
            } else {
                setCurrentSkills(profile.skills);
            }
        }
    }, [profile]);

    const handleSave = async () => {
        await updateSection('skills', currentSkills);
        onClose();
    };

    return (
        <div className="space-y-6">
            <SkillsForm
                skills={currentSkills}
                onChange={setCurrentSkills}
            />
            <div className="flex justify-end pt-4">
                <NorthernButton onClick={handleSave}>Save Changes</NorthernButton>
            </div>
        </div>
    )
}

function VolunteeringEditor({ onClose }: { onClose: () => void }) {
    const { profile, updateSection } = useProfile();
    const form = useForm<VolunteeringFormData>({
        resolver: zodResolver(volunteeringFormSchema),
        defaultValues: { volunteering: [] }
    });

    useEffect(() => {
        if (profile?.volunteering) {
            const mapped = profile.volunteering.map(item => ({
                ...item,
                achievements: item.achievements || []
            }));
            form.reset({ volunteering: mapped });
        }
    }, [profile, form]);

    const onSubmit = async (data: VolunteeringFormData) => {
        await updateSection('volunteering', data.volunteering);
        onClose();
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <VolunteeringForm form={form} />
            <div className="flex justify-end pt-4">
                <NorthernButton type="submit">Save Changes</NorthernButton>
            </div>
        </form>
    );
}

function CertificationsEditor({ onClose }: { onClose: () => void }) {
    const { profile, updateSection } = useProfile();
    const form = useForm<CertificationsFormData>({
        resolver: zodResolver(certificationsFormSchema),
        defaultValues: { certifications: [] }
    });

    useEffect(() => {
        if (profile?.certifications) {
            form.reset({ certifications: profile.certifications });
        }
    }, [profile, form]);

    const onSubmit = async (data: CertificationsFormData) => {
        await updateSection('certifications', data.certifications);
        onClose();
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CertificationsForm form={form} />
            <div className="flex justify-end pt-4">
                <NorthernButton type="submit">Save Changes</NorthernButton>
            </div>
        </form>
    );
}
