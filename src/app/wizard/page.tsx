'use client';

import { useState } from 'react';
import { WizardShell, STEPS } from '@/components/wizard/WizardShell';
import { ContactStep } from '@/components/wizard/steps/ContactStep';
import { ExperienceStep } from '@/components/wizard/steps/ExperienceStep';
import { VolunteeringStep } from '@/components/wizard/steps/VolunteeringStep';
import { EducationStep } from '@/components/wizard/steps/EducationStep';
import { CertificationsStep } from '@/components/wizard/steps/CertificationsStep';
import { SkillsStep } from '@/components/wizard/steps/SkillsStep';
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
            case 2: return <VolunteeringStep onNext={nextStep} onBack={prevStep} />;
            case 3: return <EducationStep onNext={nextStep} onBack={prevStep} />;
            case 4: return <CertificationsStep onNext={nextStep} onBack={prevStep} />;
            case 5: return <SkillsStep onNext={nextStep} onBack={prevStep} />;
            default: return null;
        }
    };

    const descriptions = [
        "Let's start with your contact details so recruiters can reach you.",
        "Tell us about your professional background and work history.",
        "Volunteering demonstrates character and community involvement.",
        "Your academic background, degrees, and qualifications.",
        "Professional certifications, licenses, and accreditations.",
        "Highlight your key technical and soft skills to stand out."
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
