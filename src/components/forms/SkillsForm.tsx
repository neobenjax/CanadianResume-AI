import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { TECHNICAL_SKILLS, SOFT_SKILLS } from '@/constants/skills';
import { UserSkills } from '@/lib/db';

interface SkillsFormProps {
    initialSkills: UserSkills;
    onChange: (skills: UserSkills) => void;
    className?: string;
}

export function SkillsForm({ initialSkills, onChange, className }: SkillsFormProps) {
    const [skills, setSkills] = useState<UserSkills>(initialSkills);

    // Technical Skills State
    const [techInput, setTechInput] = useState('');
    const [techSuggestions, setTechSuggestions] = useState<string[]>([]);
    const [activeTechIndex, setActiveTechIndex] = useState(-1);

    // Soft Skills State
    const [softInput, setSoftInput] = useState('');
    const [softSuggestions, setSoftSuggestions] = useState<string[]>([]);
    const [activeSoftIndex, setActiveSoftIndex] = useState(-1);

    useEffect(() => {
        setSkills(initialSkills);
    }, [initialSkills]);

    const updateSkills = (newSkills: UserSkills) => {
        setSkills(newSkills);
        onChange(newSkills);
    };

    // --- Technical Skills Logic ---
    useEffect(() => {
        if (techInput.length > 0) {
            const matched = TECHNICAL_SKILLS.filter(s =>
                s.toLowerCase().includes(techInput.toLowerCase()) &&
                !skills.technical.includes(s)
            ).slice(0, 6);
            setTechSuggestions(matched);
            setActiveTechIndex(-1);
        } else {
            setTechSuggestions([]);
        }
    }, [techInput, skills.technical]);

    const addTechSkill = (skill: string) => {
        if (!skills.technical.includes(skill)) {
            const newTech = [...skills.technical, skill];
            updateSkills({ ...skills, technical: newTech });
        }
        setTechInput('');
        setTechSuggestions([]);
    };

    const removeTechSkill = (skill: string) => {
        const newTech = skills.technical.filter(s => s !== skill);
        updateSkills({ ...skills, technical: newTech });
    };

    const handleTechKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveTechIndex(prev => (prev < techSuggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveTechIndex(prev => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeTechIndex >= 0 && activeTechIndex < techSuggestions.length) {
                addTechSkill(techSuggestions[activeTechIndex]);
            } else if (techInput.trim()) {
                addTechSkill(techInput.trim());
            }
        }
    };

    // --- Soft Skills Logic ---
    useEffect(() => {
        if (softInput.length > 0) {
            const matched = SOFT_SKILLS.filter(s =>
                s.toLowerCase().includes(softInput.toLowerCase()) &&
                !skills.soft.includes(s)
            ).slice(0, 6);
            setSoftSuggestions(matched);
            setActiveSoftIndex(-1);
        } else {
            setSoftSuggestions([]);
        }
    }, [softInput, skills.soft]);

    const addSoftSkill = (skill: string) => {
        if (!skills.soft.includes(skill)) {
            const newSoft = [...skills.soft, skill];
            updateSkills({ ...skills, soft: newSoft });
        }
        setSoftInput('');
        setSoftSuggestions([]);
    };

    const removeSoftSkill = (skill: string) => {
        const newSoft = skills.soft.filter(s => s !== skill);
        updateSkills({ ...skills, soft: newSoft });
    };

    const handleSoftKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSoftIndex(prev => (prev < softSuggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSoftIndex(prev => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeSoftIndex >= 0 && activeSoftIndex < softSuggestions.length) {
                addSoftSkill(softSuggestions[activeSoftIndex]);
            } else if (softInput.trim()) {
                addSoftSkill(softInput.trim());
            }
        }
    };

    return (
        <div className={`space-y-8 ${className}`}>
            {/* Technical Skills Section */}
            <GlassCard className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-200 ml-1 mb-2">Technical Skills</label>
                    <p className="text-xs text-slate-400 ml-1 mb-3">Programming languages, tools, frameworks, etc.</p>
                    <div className="relative">
                        <input
                            type="text"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={handleTechKeyDown}
                            className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 focus:ring-2 focus:ring-primary-500/50 outline-none text-slate-100 placeholder:text-slate-500"
                            placeholder="e.g. React, Python, AWS..."
                        />

                        <AnimatePresence>
                            {techSuggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute z-50 w-full mt-2 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden"
                                >
                                    {techSuggestions.map((suggestion, index) => (
                                        <button
                                            key={suggestion}
                                            type="button"
                                            onClick={() => addTechSkill(suggestion)}
                                            className={cn(
                                                "w-full text-left px-4 py-3 text-slate-300 hover:text-white transition-colors flex items-center justify-between group",
                                                index === activeTechIndex ? "bg-primary-600/20 text-white" : "hover:bg-primary-600/10"
                                            )}
                                        >
                                            {suggestion}
                                            <Plus className={cn("w-4 h-4 transition-opacity", index === activeTechIndex ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="min-h-[60px] p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                    {skills.technical.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-4">No technical skills added yet.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            <AnimatePresence>
                                {skills.technical.map(skill => (
                                    <motion.div
                                        key={skill}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="bg-primary-600/20 border border-primary-500/30 text-primary-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2 group hover:border-primary-500 transition-colors"
                                    >
                                        <span className="text-sm font-medium">{skill}</span>
                                        <button onClick={() => removeTechSkill(skill)} className="text-primary-400 hover:text-red-400 rounded-full p-0.5 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </GlassCard>

            {/* Soft Skills Section */}
            <GlassCard className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-200 ml-1 mb-2">Soft Skills</label>
                    <p className="text-xs text-slate-400 ml-1 mb-3">Interpersonal skills, leadership, etc.</p>
                    <div className="relative">
                        <input
                            type="text"
                            value={softInput}
                            onChange={(e) => setSoftInput(e.target.value)}
                            onKeyDown={handleSoftKeyDown}
                            className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 focus:ring-2 focus:ring-primary-500/50 outline-none text-slate-100 placeholder:text-slate-500"
                            placeholder="e.g. Leadership, Communication..."
                        />

                        <AnimatePresence>
                            {softSuggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute z-50 w-full mt-2 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden"
                                >
                                    {softSuggestions.map((suggestion, index) => (
                                        <button
                                            key={suggestion}
                                            type="button"
                                            onClick={() => addSoftSkill(suggestion)}
                                            className={cn(
                                                "w-full text-left px-4 py-3 text-slate-300 hover:text-white transition-colors flex items-center justify-between group",
                                                index === activeSoftIndex ? "bg-primary-600/20 text-white" : "hover:bg-primary-600/10"
                                            )}
                                        >
                                            {suggestion}
                                            <Plus className={cn("w-4 h-4 transition-opacity", index === activeSoftIndex ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="min-h-[60px] p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                    {skills.soft.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-4">No soft skills added yet.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            <AnimatePresence>
                                {skills.soft.map(skill => (
                                    <motion.div
                                        key={skill}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="bg-teal-600/20 border border-teal-500/30 text-teal-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2 group hover:border-teal-500 transition-colors"
                                    >
                                        <span className="text-sm font-medium">{skill}</span>
                                        <button onClick={() => removeSoftSkill(skill)} className="text-teal-400 hover:text-red-400 rounded-full p-0.5 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );
}
