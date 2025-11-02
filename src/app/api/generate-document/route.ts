import { NextRequest } from "next/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createClient } from "@/utils/supabase/server";

const google = createGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

const model = google("gemini-2.5-flash");

const baseContext =
	"You are an expert software documentation generator. " +
	"Generate clear, concise, and comprehensive documentation for the provided code snippet. " +
	"Ensure the documentation is well-structured and easy to understand.";

export async function POST(req: NextRequest) {
	const { snippet, document } = await req.json();

	const { language: snippetLanguage, code } = snippet;
	const { title, language: docLanguage } = document;

	if (!snippetLanguage || !code || !title) {
		return Response.json(
			{
				message: "Missing required fields",
			},
			{ status: 400 },
		);
	}

	try {
		const supabase = await createClient();

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return Response.json(
				{
					message: "Unauthorized",
				},
				{ status: 401 },
			);
		}

		const { text: documentation } = await generateText({
			model,
			messages: [
				{
					role: "user",
					content: [
						{
							type: "text",
							text:
								baseContext +
								"\n\n" +
								"Generate a detailed documentation for the following " +
								"code snippet written in " +
								snippetLanguage +
								" code snippet:\n\n" +
								code +
								"\n\nDocumentation title: " +
								title +
								"\n\nDocument language: " +
								docLanguage,
						},
					],
				},
			],
		});

		return Response.json({
			message: "Document generated successfully",
			documentation: documentation,
		});
	} catch (error) {
		return Response.json(
			{
				message: "Internal server error",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
