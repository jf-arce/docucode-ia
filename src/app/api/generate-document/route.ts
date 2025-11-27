import { NextRequest } from "next/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createClient } from "@/utils/supabase/server";

const google = createGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

const model = google("gemini-2.5-flash");

const SYSTEM_PROMPT = `
You are a Senior Technical Writer expert in creating standard, professional software documentation.
Your goal is to generate a semantic, well-structured Markdown document that serves as a perfect README section.

Strict Guidelines:
1. **Semantic Structure**: You MUST use proper Markdown hierarchy (##, ###, ####).
2. **Visual Style**: 
   - Use blockquotes (>) for callouts or important notes.
   - Use language hints in code blocks (e.g., \`\`\`typescript).
3. **Conciseness**: Keep descriptions brief and direct. Short sections. NEVER be extremely long. Focus on the "meat" of the code.

Required Structure (in order):
   - **## [Title]**: Clear name of the component/function.
   - **### Overview**: Brief description of what it does, its purpose, and why it exists.
   - **### How it Works**: High-level explanation of the logic or flow (brief).
   - **### Key Features**: Highlights in a bulleted list.
   - **### Inputs (Parameters)**: 
     - Markdown table: | Name | Type | Description |
   - **### Outputs**: Description of the return value or expected result.
   - **### Usage Example**: Concise code block showing how to implement it.
   - **### Notes & Limitations**: Technical considerations, edge cases, or constraints.
   - **### Best Practices**: Recommendations for effective use (optional).

Language: Output MUST be in the language specified by the user.
Context: Focus only on the provided snippet. Do not hallucinate external context.
`;

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { snippet, document } = body;

	if (!snippet?.language || !snippet?.code || !document?.title) {
		return Response.json({ message: "Missing required fields" }, { status: 400 });
	}

	const { language: snippetLanguage, code } = snippet;
	const { language: docLanguage } = document;

	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		// 2. Generación con Gemini
		// Usamos 'system' para las reglas y 'prompt' para la data dinámica
		const { text: documentation } = await generateText({
			model,
			system: SYSTEM_PROMPT,
			temperature: 0.2, // Precisión alta, menos creatividad
			prompt: `
        Please generate documentation for the following code snippet.

        --- METADATA ---
        - Snippet Language: ${snippetLanguage}
        - Target Language for Documentation: ${docLanguage || "English"}

        --- CODE SNIPPET ---
        \`\`\`${snippetLanguage}
        ${code}
        \`\`\`
      `,
		});

		return Response.json({
			message: "Document generated successfully",
			documentation: documentation,
		});
	} catch (error) {
		console.error("Error generating docs:", error);
		return Response.json(
			{
				message: "Internal server error",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
