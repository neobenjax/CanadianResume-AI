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
    skills: string[]; // List of skill strings
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

        // Schema migration: always add new versions for changes
        this.version(1).stores({
            user_profile: '++id', // We generally query by simple .get(1)
            resumes: '++id, title, updatedAt'
        });
    }
}

export const db = new MapleLeafDB();

// Helper to ensure profile exists
export async function initProfile() {
    const count = await db.user_profile.count();
    if (count === 0) {
        await db.user_profile.add({
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
            skills: [],
            updatedAt: new Date(),
        });
    }
}
