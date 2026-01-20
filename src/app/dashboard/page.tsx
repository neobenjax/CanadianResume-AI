'use client';

import { useResumes } from '@/hooks/use-resumes';
import { useProfile } from '@/hooks/use-profile'; // To clone data
import { GlassCard } from '@/components/ui/GlassCard';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { FileText, MoreVertical, Plus, Calendar, Trash2, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { formatDistanceToNow } from 'date-fns';

function formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export default function DashboardPage() {
    const { resumes, createResumeFromProfile, deleteResume } = useResumes();
    const { profile } = useProfile();
    const router = useRouter();

    const handleCreateResume = async () => {
        if (!profile) return;
        const title = `Resume ${new Date().toLocaleDateString('en-CA')}`;
        const id = await createResumeFromProfile(title, profile);
        router.push(`/dashboard/resumes/${id}`);
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this resume?')) {
            await deleteResume(id);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Resumes</h1>
                    <p className="text-slate-500 mt-1">Manage and tailor your resumes for different applications.</p>
                </div>
                <NorthernButton onClick={handleCreateResume} className="shadow-violet-500/20">
                    <Plus className="w-5 h-5 mr-2" /> Create New
                </NorthernButton>
            </div>

            {!resumes || resumes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No resumes yet</h3>
                    <p className="text-slate-500 max-w-md text-center mb-6">Create your first resume by using your profile data. You can tailor it for specific jobs later.</p>
                    <NorthernButton onClick={handleCreateResume}>
                        Create Resume
                    </NorthernButton>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resumes.map((resume) => (
                        <GlassCard
                            key={resume.id}
                            hoverEffect
                            className="relative flex flex-col h-full cursor-pointer group"
                            onClick={() => router.push(`/dashboard/resumes/${resume.id}`)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={(e) => handleDelete(e, resume.id!)}
                                        className="p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mb-1">{resume.title}</h3>
                            <p className="text-sm text-slate-500 mb-6">Target: General Application</p>

                            <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-medium">
                                <span className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {formatDate(resume.updatedAt)}
                                </span>
                                <span>v1.0</span>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
}
