import { UserProfile } from "@/lib/db";

export function buildCanadianizerPrompt(profile: UserProfile, jobDescription: string) {
    const skills = profile.skills.join(', ');
    const experience = profile.experience.map(exp => `
    - Role: ${exp.role} at ${exp.company} (${exp.startDate} to ${exp.endDate || 'Present'})
    - Location: ${exp.city}, ${exp.province}
    - Achievements:
    ${exp.achievements.map(a => `  * ${a}`).join('\n')}
    `).join('\n');

    return `
    You are an expert Canadian Resume Writer and Career Coach. 
    Your task is to rewrite the candidate's experience to strictly match the provided Job Description, adhering to Canadian resume standards.

    ### Rules & Standards:
    1. **Spelling**: Use strictly Canadian/British spelling (e.g., colour, centre, programme, analyze).
    2. **Format**: Use the STAR method (Situation, Task, Action, Result) for all bullet points.
    3. **Tone**: Professional, confident, but modest. Avoid hyperbole.
    4. **Exclusions**: Do NOT include photos, age, marital status, or full street addresses (City/Province is sufficient).
    5. **Keywords**: Naturally integrate keywords from the Job Description.

    ### Inputs:
    
    **Job Description**:
    ${jobDescription}

    **Candidate Profile**:
    - Name: ${profile.contact.fullName}
    - Skills: ${skills}
    - Experience:
    ${experience}

    ### Output Format (JSON):
    Provide a JSON object with the following structure:
    {
        "summary": "A 2-3 sentence professional summary tailored to the job.",
        "experience": [
            {
                "role": "Match from profile or adjust slightly for JD match",
                "company": "From profile",
                "points": ["STAR point 1", "STAR point 2", "STAR point 3"]
            }
        ]
    }
    `;
}
