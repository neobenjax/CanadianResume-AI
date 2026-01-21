import Dexie, { Table } from 'dexie';

// --- Interfaces ---

export interface ExperienceItem {
    id: string; // UUID for UI keys
    role: string;
    company: string;
    city: string;
    province: string;
    country: string; // Default 'Canada'
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    achievements: string[]; // STAR method points
}

export interface EducationItem {
    id: string;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
}

export interface UserSkills {
    technical: string[];
    soft: string[];
}

export interface UserProfile {
    id?: number; // Should be 1 for the singleton profile
    contact: {
        fullName: string;
        email: string;
        phone: string;
        city: string;
        province: string;
        linkedin?: string;
        website?: string;
    };
    experience: ExperienceItem[];
    education: EducationItem[];
    volunteering: ExperienceItem[];
    certifications: any[];
    skills: UserSkills; // CHANGED: Now an object with technical and soft arrays
    updatedAt: Date;
}

export interface Resume {
    id?: number;
    title: string;
    targetJobDescription?: string; // Content of JD
    generatedContent: any; // AI output or customized state
    createdAt: Date;
    updatedAt: Date;
}

// --- Database Class ---

export class MapleLeafDB extends Dexie {
    user_profile!: Table<UserProfile>;
    resumes!: Table<Resume>;

    constructor() {
        super('MapleLeafDB');

        // Version 1: Original Schema
        this.version(1).stores({
            user_profile: '++id',
            resumes: '++id, title, updatedAt'
        });

        // Version 2: Skills segmentation migration
        this.version(2).stores({
            user_profile: '++id',
        }).upgrade(tx => {
            return tx.table('user_profile').toCollection().modify(profile => {
                // Check if skills is an array (Old format)
                if (Array.isArray(profile.skills)) {
                    // Move all existing string skills to 'technical' as a fallback safety
                    // In a real app we might try to infer, but safety first.
                    profile.skills = {
                        technical: profile.skills,
                        soft: []
                    };
                }
            });
        });
    }
}

export const db = new MapleLeafDB();


export const PROFILE_ID = 1;

// Helper to ensure profile exists
export async function initProfile() {
    // Check for the specific profile ID 1
    const profile = await db.user_profile.get(PROFILE_ID);

    if (!profile) {
        await db.user_profile.put({
            id: PROFILE_ID,
            contact: {
                fullName: '',
                email: '',
                phone: '',
                city: '',
                province: '',
            },
            experience: [],
            education: [],
            volunteering: [],
            certifications: [],
            skills: { technical: [], soft: [] },
            updatedAt: new Date(),
        });
    }
}

// Helper to reset the profile (Clean Slate)
export async function resetProfile() {
    await db.user_profile.clear();
    // We don't re-init here. We let the next page load (Wizard or Dashboard) handle init if needed,
    // or specifically the Wizard will start fresh. 
    // Actually, initProfile() checks if it exists, so if we clear it, initProfile will create a blank one.
    // But for the "Wizard" flow, we want it empty so the Wizard can verify.
    // However, the Wizard steps often rely on useProfile() which calls initProfile(). 
    // So clearing it is enough; the next component to load useProfile will create a fresh blank one.
}
