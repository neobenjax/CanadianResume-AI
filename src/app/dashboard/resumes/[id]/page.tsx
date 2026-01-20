'use client';

import { useEffect, useState } from 'react';
import { useResume } from '@/hooks/use-resume';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowLeft, Save, Sparkles, Download, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { generateTailoredContent } from '@/services/ai/actions';
import { DocxGenerator } from '@/lib/export/docx-generator';

export default function ResumeEditorPage({ params }: { params: { id: string } }) {
    const resumeId = parseInt(params.id);
    const { resume, isLoading: isResumeLoading, updateResumeContent, updateTitle } = useResume(resumeId);
    const router = useRouter();

    const [isAiLoading, setIsAiLoading] = useState(false);
    const [jobDescription, setJobDescription] = useState('');
    const [showAiPanel, setShowAiPanel] = useState(false);

    if (isNaN(resumeId)) {
        return <div>Invalid Query ID</div>;
    }

    if (isResumeLoading) {
        return <div className="p-10 text-center">Loading resume...</div>;
    }

    if (!resume) {
        return <div className="p-10 text-center">Resume not found</div>;
    }

    const handleCanadianize = async () => {
        if (!jobDescription.trim()) return;

        setIsAiLoading(true);
        try {
            // We pass the *current* content (snapshot) as the profile source
            // In a real app we might want to fetch the "live" profile, but here we work on the snapshot
            const newContent = await generateTailoredContent(resume.generatedContent, jobDescription);

            // Merge the AI result with the existing content
            // The AI service returns { summary, experience: [...] }
            // We update the resume's generatedContent
            const updatedContent = {
                ...resume.generatedContent,
                summary: newContent.summary,
                // We need to carefully merge experience to preserve IDs if possible, or just replace
                // For MVP, we'll replace the experience list's descriptions
                experience: newContent.experience
            };

            await updateResumeContent(updatedContent);
            setShowAiPanel(false);
        } catch (err) {
            console.error(err);
            alert('Failed to optimize resume');
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <NorthernButton variant="ghost" className="pl-0">
                            <ArrowLeft className="w-5 h-5 mr-1" /> Back
                        </NorthernButton>
                    </Link>
                    <div>
                        <input
                            type="text"
                            value={resume.title}
                            onChange={(e) => updateTitle(e.target.value)}
                            className="text-2xl font-bold bg-transparent border-none focus:ring-0 text-slate-900 p-0"
                        />
                        <p className="text-sm text-slate-500">Last updated: {resume.updatedAt.toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <NorthernButton
                        variant="secondary"
                        onClick={() => setShowAiPanel(!showAiPanel)}
                        className={showAiPanel ? "bg-primary-100 text-primary-700" : ""}
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {showAiPanel ? 'Close AI Tools' : 'Canadianize'}
                    </NorthernButton>
                    <NorthernButton onClick={() => DocxGenerator.generate(resume)}>
                        <Download className="w-4 h-4 mr-2" /> Export DOCX
                    </NorthernButton>
                </div>
            </div>

            {/* AI Panel */}
            {showAiPanel && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <GlassCard className="border-primary-200 bg-primary-50/50">
                        <h3 className="font-semibold text-primary-900 mb-2 flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-primary-600" />
                            Optimize for Job Description
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                            Paste the job description below. Our "Canadianizer" AI will tailor your summary and experience points using the STAR method and Canadian spelling standards.
                        </p>
                        <textarea
                            className="w-full p-4 rounded-xl border border-primary-200 focus:ring-2 focus:ring-primary-500/50 outline-none h-32 mb-4 bg-white/80"
                            placeholder="Paste Job Description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <NorthernButton onClick={handleCanadianize} isLoading={isAiLoading} disabled={!jobDescription.trim()} className="shadow-glow-primary">
                                Generate Tailored Content
                            </NorthernButton>
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* Editor Area (Read-onlyish view for MVP, or Simple Edit) */}
            <div className="grid gap-6">
                <GlassCard>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Professional Summary</h3>
                    <div className="p-4 bg-white/50 rounded-xl border border-slate-100">
                        {/* In a real app, this would be an editable text area */}
                        {resume.generatedContent.summary || (
                            <p className="text-slate-400 italic">No summary generated yet. Use the Canadianize tool!</p>
                        )}
                    </div>
                </GlassCard>

                <GlassCard>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Experience</h3>
                    <div className="space-y-6">
                        {resume.generatedContent.experience && resume.generatedContent.experience.map((exp: any, idx: number) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between">
                                    <h4 className="font-semibold text-slate-800">{exp.role}</h4>
                                    <span className="text-slate-500 text-sm">{exp.company}</span>
                                </div>
                                <ul className="list-disc ml-5 space-y-1 text-slate-700">
                                    {exp.points ? exp.points.map((point: string, pIdx: number) => (
                                        <li key={pIdx}>{point}</li>
                                    )) : exp.achievements ? exp.achievements.map((point: string, pIdx: number) => (
                                        <li key={pIdx}>{point}</li>
                                    )) : (
                                        <li className="text-slate-400 italic">No points listed</li>
                                    )}
                                </ul>
                            </div>
                        ))}
                        {(!resume.generatedContent.experience || resume.generatedContent.experience.length === 0) && (
                            <p className="text-slate-400 italic">No experience entries found.</p>
                        )}
                    </div>
                </GlassCard>

                <GlassCard>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {resume.generatedContent.skills && resume.generatedContent.skills.map((skill: string) => (
                            <span key={skill} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100">
                                {skill}
                            </span>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
