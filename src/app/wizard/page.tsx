'use client';

import { useState } from 'react';
import { WizardShell, STEPS } from '@/components/wizard/WizardShell';
import { ContactStep } from '@/components/wizard/steps/ContactStep';
import { ExperienceStep } from '@/components/wizard/steps/ExperienceStep';
import { EducationStep } from '@/components/wizard/steps/EducationStep';
import { SkillsStep } from '@/components/wizard/steps/SkillsStep';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { useRouter } from 'next/navigation';

export default function WizardPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(curr => curr + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Finish - Redirect to Dashboard
            router.push('/dashboard');
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(curr => curr - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0: return <ContactStep onNext={nextStep} />;
            case 1: return <ExperienceStep onNext={nextStep} onBack={prevStep} />;
            case 2: return (
                <div className="space-y-4">
                    <p>Volunteering Step (Coming Soon - Skip for MVP)</p>
                    <div className="flex justify-between">
                        <NorthernButton variant="ghost" onClick={prevStep}>Back</NorthernButton>
                        <NorthernButton onClick={nextStep}>Next</NorthernButton>
                    </div>
                </div>
            );
            case 3: return <EducationStep onNext={nextStep} onBack={prevStep} />;
            case 4: return (
                <div className="space-y-4">
                    <p>Certifications Step (Coming Soon - Skip for MVP)</p>
                    <div className="flex justify-between">
                        <NorthernButton variant="ghost" onClick={prevStep}>Back</NorthernButton>
                        <NorthernButton onClick={nextStep}>Next</NorthernButton>
                    </div>
                </div>
            );
            case 5: return <SkillsStep onNext={nextStep} onBack={prevStep} />;
            default: return null;
        }
    };

    const descriptions = [
        "Let's start with your contact details so recruiters can reach you.",
        "Tell us about your professional background.",
        "Volunteering is highly valued in Canada. List your contributions.",
        "Your academic background and qualifications.",
        "Any professional certifications or licenses.",
        "Highlight your key technical and soft skills."
    ];

    return (
        <div className="min-h-screen py-10 px-4">
            <WizardShell
                currentStepIndex={currentStep}
                stepTitle={STEPS[currentStep].title}
                stepDescription={descriptions[currentStep] || ""}
            >
                {renderStep()}
            </WizardShell>
        </div>
    );
}
