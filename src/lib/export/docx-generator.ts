import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { Resume } from "@/lib/db";

export class DocxGenerator {
    static async generate(resume: Resume) {
        const { generatedContent: content } = resume;
        const { contact } = content;

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        // Header: Name
                        new Paragraph({
                            text: contact.fullName,
                            heading: HeadingLevel.TITLE,
                            alignment: AlignmentType.CENTER,
                        }),
                        // Contact Info
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun(`${content.contact.city}, ${content.contact.province} | `),
                                new TextRun(`${content.contact.phone} | `),
                                new TextRun(content.contact.email),
                                content.contact.linkedin ? new TextRun(` | ${content.contact.linkedin}`) : new TextRun(""),
                            ],
                        }),
                        new Paragraph({ text: "" }), // Spacer

                        // Summary Section
                        new Paragraph({
                            text: "PROFESSIONAL SUMMARY",
                            heading: HeadingLevel.HEADING_1,
                            thematicBreak: true,
                        }),
                        new Paragraph({
                            children: [new TextRun(content.summary || "")],
                        }),
                        new Paragraph({ text: "" }),

                        // Skills Section
                        new Paragraph({
                            text: "SKILLS",
                            heading: HeadingLevel.HEADING_1,
                            thematicBreak: true,
                        }),
                        new Paragraph({
                            children: [new TextRun((content.skills || []).join(" • "))],
                        }),
                        new Paragraph({ text: "" }),

                        // Experience Section
                        new Paragraph({
                            text: "PROFESSIONAL EXPERIENCE",
                            heading: HeadingLevel.HEADING_1,
                            thematicBreak: true,
                        }),
                        ...(content.experience || []).flatMap((exp: any) => [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: exp.role,
                                        bold: true,
                                        size: 24, // 12pt
                                    }),
                                    new TextRun({
                                        text: `\t${exp.company} | ${exp.city}, ${exp.province}`,
                                        bold: true,
                                    })
                                ],
                                tabStops: [
                                    { position: 9000, type: "right" as any } // Right align date/location roughly
                                ]
                            }),
                            // Date row if needed or combine with company
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `${exp.startDate} - ${exp.endDate || 'Present'}`,
                                        italics: true,
                                    })
                                ]
                            }),
                            // Points
                            ...(exp.points || exp.achievements || []).map((point: string) =>
                                new Paragraph({
                                    text: point,
                                    bullet: { level: 0 }
                                })
                            ),
                            new Paragraph({ text: "" }),
                        ]),

                        // Education Section
                        new Paragraph({
                            text: "EDUCATION",
                            heading: HeadingLevel.HEADING_1,
                            thematicBreak: true,
                        }),
                        ...(content.education || []).flatMap((edu: any) => [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: edu.institution, bold: true }),
                                    new TextRun(`\t${edu.location}`),
                                ],
                                tabStops: [{ position: 9000, type: "right" as any }]
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({ text: `${edu.degree}`, italics: true }),
                                    new TextRun(`\t${edu.startDate} - ${edu.endDate}`),
                                ],
                                tabStops: [{ position: 9000, type: "right" as any }]
                            }),
                            new Paragraph({ text: "" }),
                        ])
                    ],
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${resume.title.replace(/\s+/g, '_')}.docx`);
    }
}
