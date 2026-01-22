'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { GlassCard } from '@/components/ui/GlassCard';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { Edit2, ExternalLink, Mail, MapPin, Phone, Linkedin, Globe, Cloud } from 'lucide-react';
import { ProfileEditSection } from './ProfileEditSection';
import { DriveService } from '@/lib/google-drive';
import { useGoogleLogin } from '@react-oauth/google';

export function ProfileView() {
    const { profile, isLoading } = useProfile();
    const [editingSection, setEditingSection] = useState<'contact' | 'experience' | 'education' | 'skills' | 'volunteering' | 'certifications' | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isSynced, setIsSynced] = useState(false);

    // Google Login for Sync
    const syncLogin = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/drive.appdata',
        onSuccess: async (tokenResponse) => {
            setIsSyncing(true);
            try {
                const driveService = new DriveService(tokenResponse.access_token);
                if (profile) {
                    const profileToSave = { ...profile };
                    delete profileToSave.id;
                    await driveService.saveProfile(profileToSave);
                    setIsSynced(true);
                    setTimeout(() => setIsSynced(false), 5000); // Reset after 5s
                }
            } catch (error) {
                console.error('Sync failed', error);
                alert('Sync failed. Please try again.');
            } finally {
                setIsSyncing(false);
            }
        },
        onError: () => alert('Google Auth Failed')
    });

    if (isLoading || !profile) {
        return <div className="p-12 text-center text-slate-400">Loading profile...</div>;
    }

    const { contact, experience, education, skills } = profile;
    const skillsObj = Array.isArray(skills) ? { technical: skills, soft: [] } : skills;

    return (
        <div className="space-y-8 pb-20">
            {/* Header / Contact Section */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                    <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
                        {contact.email && <span className="flex items-center"><Mail className="w-4 h-4 mr-1" /> {contact.email}</span>}
                        {contact.phone && <span className="flex items-center"><Phone className="w-4 h-4 mr-1" /> {contact.phone}</span>}
                        {(contact.city || contact.province) && <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {contact.city}, {contact.province}</span>}
                    </div>
                </div>
                <div className="flex gap-2">
                    <NorthernButton
                        variant="secondary"
                        onClick={() => !isSynced && syncLogin()}
                        isLoading={isSyncing}
                        className={`transition-all duration-300 border ${isSynced
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10 cursor-default"
                            : "bg-white/10 text-white hover:bg-white/20 border-white/10 shadow-lg shadow-black/20"}`}
                        disabled={isSynced}
                    >
                        {isSynced ? (
                            <><Cloud className="w-4 h-4 mr-2" /> Synced</>
                        ) : (
                            <><Cloud className="w-4 h-4 mr-2" /> Sync to Drive</>
                        )}
                    </NorthernButton>
                </div>
            </div>

            {/* Contact Details Card */}
            <GlassCard className="relative group">
                <button
                    onClick={() => setEditingSection('contact')}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-primary-400 transition-colors bg-white/5 rounded-lg opacity-0 group-hover:opacity-100"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <h3 className="text-lg font-semibold text-primary-300 mb-4 border-b border-white/10 pb-2">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                    <div className="space-y-2">
                        <div className="flex justify-between"><span className="text-slate-500">Full Name:</span> <span>{contact.fullName}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Email:</span> <span>{contact.email}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Phone:</span> <span>{contact.phone}</span></div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between"><span className="text-slate-500">Location:</span> <span>{contact.city}, {contact.province}</span></div>
                        {contact.linkedin && <div className="flex justify-between"><span className="text-slate-500 flex items-center"><Linkedin className="w-3 h-3 mr-1" /> LinkedIn:</span> <a href={contact.linkedin} target="_blank" className="text-primary-400 hover:underline truncate max-w-[200px]">{contact.linkedin}</a></div>}
                        {contact.website && <div className="flex justify-between"><span className="text-slate-500 flex items-center"><Globe className="w-3 h-3 mr-1" /> Website:</span> <a href={contact.website} target="_blank" className="text-primary-400 hover:underline truncate max-w-[200px]">{contact.website}</a></div>}
                    </div>
                </div>
            </GlassCard>

            {/* Experience Section */}
            <GlassCard className="relative group">
                <button
                    onClick={() => setEditingSection('experience')}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-primary-400 transition-colors bg-white/5 rounded-lg opacity-0 group-hover:opacity-100"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <h3 className="text-lg font-semibold text-primary-300 mb-4 border-b border-white/10 pb-2">Work Experience</h3>
                <div className="space-y-6">
                    {experience.length === 0 && <p className="text-slate-500 italic">No experience added.</p>}
                    {experience.map((exp) => (
                        <div key={exp.id} className="relative pl-4 border-l-2 border-slate-700">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-medium text-white text-lg">{exp.role}</h4>
                                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                                    {exp.startDate} - {exp.endDate || 'Present'}
                                </span>
                            </div>
                            <div className="text-primary-400 text-sm mb-2">{exp.company} • {exp.city}, {exp.country}</div>
                            <ul className="list-disc list-inside text-slate-400 text-sm space-y-1">
                                {exp.achievements?.map((ach, i) => (
                                    <li key={i}>{ach}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* Education Section */}
            <GlassCard className="relative group">
                <button
                    onClick={() => setEditingSection('education')}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-primary-400 transition-colors bg-white/5 rounded-lg opacity-0 group-hover:opacity-100"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <h3 className="text-lg font-semibold text-primary-300 mb-4 border-b border-white/10 pb-2">Education</h3>
                <div className="space-y-6">
                    {education.length === 0 && <p className="text-slate-500 italic">No education added.</p>}
                    {education.map((edu) => (
                        <div key={edu.id} className="flex justify-between items-start">
                            <div>
                                <h4 className="font-medium text-white">{edu.degree}</h4>
                                <div className="text-slate-400 text-sm">{edu.institution}, {edu.location}</div>
                            </div>
                            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                                {edu.startDate} - {edu.endDate}
                            </span>
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* Volunteering Section */}
            <GlassCard className="relative group">
                <button
                    onClick={() => setEditingSection('volunteering')}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-primary-400 transition-colors bg-white/5 rounded-lg opacity-0 group-hover:opacity-100"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <h3 className="text-lg font-semibold text-primary-300 mb-4 border-b border-white/10 pb-2">Volunteering</h3>
                <div className="space-y-6">
                    {(!profile.volunteering || profile.volunteering.length === 0) && <p className="text-slate-500 italic">No volunteering added.</p>}
                    {profile.volunteering?.map((vol) => (
                        <div key={vol.id} className="relative pl-4 border-l-2 border-slate-700">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-medium text-white text-lg">{vol.role}</h4>
                                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                                    {vol.startDate} - {vol.endDate || 'Present'}
                                </span>
                            </div>
                            <div className="text-primary-400 text-sm mb-2">{vol.company} • {vol.city}, {vol.country}</div>
                            <ul className="list-disc list-inside text-slate-400 text-sm space-y-1">
                                {vol.achievements?.map((ach, i) => (
                                    <li key={i}>{ach}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* Certifications Section */}
            <GlassCard className="relative group">
                <button
                    onClick={() => setEditingSection('certifications')}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-primary-400 transition-colors bg-white/5 rounded-lg opacity-0 group-hover:opacity-100"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <h3 className="text-lg font-semibold text-primary-300 mb-4 border-b border-white/10 pb-2">Certifications</h3>
                <div className="space-y-4">
                    {(!profile.certifications || profile.certifications.length === 0) && <p className="text-slate-500 italic">No certifications added.</p>}
                    <div className="grid md:grid-cols-2 gap-4">
                        {profile.certifications?.map((cert) => (
                            <div key={cert.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                                <h4 className="font-medium text-white text-sm mb-1">{cert.name}</h4>
                                <div className="text-slate-400 text-xs mb-2">{cert.issuer}</div>
                                <div className="flex gap-3 text-xs text-slate-500">
                                    <span>Issued: {cert.date}</span>
                                    {cert.expiryDate && <span>Expires: {cert.expiryDate}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </GlassCard>

            {/* Skills Section */}
            <GlassCard className="relative group">
                <button
                    onClick={() => setEditingSection('skills')}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-primary-400 transition-colors bg-white/5 rounded-lg opacity-0 group-hover:opacity-100"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <h3 className="text-lg font-semibold text-primary-300 mb-4 border-b border-white/10 pb-2">Skills</h3>

                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Technical</h4>
                        <div className="flex flex-wrap gap-2">
                            {skillsObj.technical.length === 0 && <span className="text-slate-600 text-sm">None</span>}
                            {skillsObj.technical.map(skill => (
                                <span key={skill} className="px-3 py-1 bg-primary-600/20 text-primary-200 rounded-lg text-sm border border-primary-500/20">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Soft Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {skillsObj.soft.length === 0 && <span className="text-slate-600 text-sm">None</span>}
                            {skillsObj.soft.map(skill => (
                                <span key={skill} className="px-3 py-1 bg-teal-600/20 text-teal-200 rounded-lg text-sm border border-teal-500/20">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Edit Modal */}
            <ProfileEditSection
                section={editingSection}
                onClose={() => setEditingSection(null)}
            />
        </div>
    );
}
