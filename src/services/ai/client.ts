// This is a client-side service for the MVP
// In a production app with a private key, this would call a Next.js Server Action
import { buildCanadianizerPrompt } from "./prompt-builder";
import { UserProfile } from "@/lib/db";

export async function generateResumeContent(profile: UserProfile, jobDescription: string, apiKey: string) {
    if (!apiKey) {
        throw new Error("API Key is required");
    }

    const prompt = buildCanadianizerPrompt(profile, jobDescription);

    // Mocking the API call for now to demonstrate structure
    // This would be replaced by fetch('https://api.openai.com/v1/...')

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Valid JSON Mock Data
    return {
        summary: `Results-oriented ${profile.experience[0]?.role} with over 5 years of experience in the Canadian tech sector. Proven track record in delivery high-quality solutions using ${profile.skills.slice(0, 3).join(', ')}.`,
        experience: profile.experience.map(exp => ({
            role: exp.role,
            company: exp.company,
            points: [
                `Utilized ${profile.skills[0]} to enhance system performance by 15%, demonstrating strong technical proficiency.`,
                `Collaborated within a cross-functional team in ${exp.city} to deliver project milestones ahead of schedule.`,
                `Led the implementation of key features which resulted in increased user engagement.`
            ]
        }))
    };
}
