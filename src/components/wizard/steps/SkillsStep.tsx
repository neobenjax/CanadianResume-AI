import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { ArrowLeft, Check, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/GlassCard';
import { SKILLS_LIST } from '@/data/skills-list';
import { motion, AnimatePresence } from 'framer-motion';

export function SkillsStep({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
    const { profile, updateSection, isLoading } = useProfile();
    const [input, setInput] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
        if (profile?.skills) {
            setSelectedSkills(profile.skills);
        }
    }, [profile]);

    // Predictive search logic
    useEffect(() => {
        if (input.length > 1) {
            const matched = SKILLS_LIST.filter(s =>
                s.toLowerCase().includes(input.toLowerCase()) &&
                !selectedSkills.includes(s)
            ).slice(0, 6);
            setSuggestions(matched);
            setActiveIndex(-1);
        } else {
            setSuggestions([]);
        }
    }, [input, selectedSkills]);

    const addSkill = (skill: string) => {
        if (!selectedSkills.includes(skill)) {
            const newSkills = [...selectedSkills, skill];
            setSelectedSkills(newSkills);
            updateSection('skills', newSkills);
        }
        setInput('');
        setSuggestions([]);
        setActiveIndex(-1);
    };

    const removeSkill = (skill: string) => {
        const newSkills = selectedSkills.filter(s => s !== skill);
        setSelectedSkills(newSkills);
        updateSection('skills', newSkills);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < suggestions.length) {
                addSkill(suggestions[activeIndex]);
            } else if (input.trim()) {
                addSkill(input.trim());
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GlassCard className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-200 ml-1 mb-2">Add Skills</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 focus:ring-2 focus:ring-primary-500/50 outline-none text-slate-100 placeholder:text-slate-500"
                            placeholder="Type a skill (e.g. React, Project Management)..."
                        />

                        {/* Autocomplete Dropdown */}
                        <AnimatePresence>
                            {suggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute z-50 w-full mt-2 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden"
                                >
                                    {suggestions.map((suggestion, index) => (
                                        <button
                                            key={suggestion}
                                            type="button"
                                            onClick={() => addSkill(suggestion)}
                                            className={cn(
                                                "w-full text-left px-4 py-3 text-slate-300 hover:text-white transition-colors flex items-center justify-between group",
                                                index === activeIndex ? "bg-primary-600/20 text-white" : "hover:bg-primary-600/10"
                                            )}
                                        >
                                            {suggestion}
                                            <Plus className={cn("w-4 h-4 transition-opacity", index === activeIndex ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Selected Skills Cloud */}
                <div className="min-h-[100px] p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                    {selectedSkills.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-8">No skills added yet. Start typing above.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            <AnimatePresence>
                                {selectedSkills.map(skill => (
                                    <motion.div
                                        key={skill}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="bg-primary-600/20 border border-primary-500/30 text-primary-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2 group hover:border-primary-500 transition-colors"
                                    >
                                        <span className="text-sm font-medium">{skill}</span>
                                        <button onClick={() => removeSkill(skill)} className="text-primary-400 hover:text-red-400 rounded-full p-0.5 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                <div className="pt-2">
                    <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Suggested for you</h4>
                    <div className="flex flex-wrap gap-2">
                        {SKILLS_LIST.slice(0, 8).filter(s => !selectedSkills.includes(s)).map(skill => (
                            <button
                                key={skill}
                                onClick={() => addSkill(skill)}
                                className="bg-transparent border border-slate-700 text-slate-400 px-3 py-1.5 rounded-lg text-sm hover:border-primary-500 hover:text-primary-300 transition-colors"
                            >
                                + {skill}
                            </button>
                        ))}
                    </div>
                </div>
            </GlassCard>

            <div className="flex justify-between pt-6">
                <NorthernButton type="button" variant="ghost" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </NorthernButton>
                <NorthernButton type="button" onClick={onNext} className="shadow-glow-primary bg-gradient-to-r from-primary-600 to-accent-600 border-none">
                    Finish Profile <Check className="w-4 h-4 ml-2" />
                </NorthernButton>
            </div>
        </div>
    )
}
