import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { ArrowLeft, Check } from 'lucide-react';
import { SkillsForm } from '@/components/forms/SkillsForm';
import { UserSkills } from '@/lib/db';

export function SkillsStep({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
    const { profile, updateSection, isLoading } = useProfile();
    const [currentSkills, setCurrentSkills] = useState<UserSkills>({ technical: [], soft: [] });

    useEffect(() => {
        if (profile?.skills) {
            // Migration handling: if skills is still an array (old data), put it in technical
            if (Array.isArray(profile.skills)) {
                setCurrentSkills({
                    technical: profile.skills,
                    soft: []
                });
            } else {
                setCurrentSkills(profile.skills);
            }
        }
    }, [profile]);

    const handleSkillsChange = (newSkills: UserSkills) => {
        setCurrentSkills(newSkills);
        updateSection('skills', newSkills);
    };

    const onFinish = async () => {
        await updateSection('skills', currentSkills);
        onNext();
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SkillsForm
                initialSkills={currentSkills}
                onChange={handleSkillsChange}
            />

            <div className="flex justify-between pt-6">
                <NorthernButton type="button" variant="ghost" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </NorthernButton>
                <NorthernButton type="button" onClick={onFinish} className="shadow-glow-primary bg-gradient-to-r from-primary-600 to-accent-600 border-none">
                    Finish Profile <Check className="w-4 h-4 ml-2" />
                </NorthernButton>
            </div>
        </div>
    )
}
