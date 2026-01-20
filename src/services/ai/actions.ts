'use server';

import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { UserProfile } from '@/lib/db';
import { buildCanadianizerPrompt } from './prompt-builder';

// Schema for the structured output we want from the LLM
const resumeContentSchema = z.object({
    summary: z.string().describe("A professional summary tailored to the job description."),
    experience: z.array(z.object({
        role: z.string(),
        company: z.string(),
        points: z.array(z.string()).describe("List of achievements using STAR method.")
    })).describe("Revised experience entries")
});

export async function generateTailoredContent(
    profile: UserProfile,
    jobDescription: string,
    apiKey?: string
) {
    // In a real app, you might use process.env.OPENAI_API_KEY
    // For this local-first app, we might accept it from the client if the user provides it,
    // OR rely on the server env.

    const keyToUse = apiKey || process.env.OPENAI_API_KEY;

    if (!keyToUse) {
        // Return mock data if no key is present, to ensure the UI works for the demo
        return {
            summary: `[MOCK] Results-oriented ${profile.experience[0]?.role || 'Professional'} tailored for: ${jobDescription.substring(0, 20)}...`,
            experience: profile.experience.map(exp => ({
                role: exp.role,
                company: exp.company,
                points: [
                    `[MOCK STAR] Achieved X by doing Y effectively.`,
                    `[MOCK STAR] Led initiative Z resulting in W improvement.`,
                    `[MOCK STAR] Collaborated with team to deliver quality code.`
                ]
            }))
        };
    }

    // If we had the real SDK installed, we would run this:
    /*
    const prompt = buildCanadianizerPrompt(profile, jobDescription);
    
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: resumeContentSchema,
      prompt: prompt,
    });
  
    return object;
    */

    throw new Error("Real AI generation requires 'ai' and '@ai-sdk/openai' packages which are not fully configured in this scaffold yet. Please use the Mock mode or install these packages.");
}
