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

	const { language, code } = snippet;
	const { title, project_id, language: docLanguage } = document;

	if (!language || !code || !title || !project_id) {
		return Response.json(
			{
				message: "Missing required fields",
			},
			{ status: 400 },
		);
	}


	try {
		const supabase = await createClient();

		// Verificar que el usuario esté autenticado
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

		console.log("User authenticated:", user.id);
		console.log("Generating documentation for:", { language, title, project_id });

		// Generar la documentación con IA
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
								language +
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

		console.log("Documentation generated successfully");

		// 1. Guardar el snippet de código
		console.log("Inserting snippet...");
		const { data: snippetData, error: snippetError } = await supabase
			.from("snippets")
			.insert({
				code: code,
				lenguage: language,
			})
			.select()
			.single();

		if (snippetError) {
			console.error("Error saving snippet:", snippetError);
			throw new Error(`Snippet error: ${snippetError.message}`);
		}

		console.log("Snippet saved:", snippetData.id);

		// 2. Guardar el documento con la documentación generada
		console.log("Inserting document...");
		const { data: documentData, error: documentError } = await supabase
			.from("documents")
			.insert({
				title: title,
				content: documentation,
				project_id: project_id,
				snippet_id: snippetData.id,
			})
			.select()
			.single();

		if (documentError) {
			console.error("Error saving document:", documentError);
			throw new Error(`Document error: ${documentError.message}`);
		}

		console.log("Document saved:", documentData.id);

		return Response.json({
			message: "Document generated and saved successfully",
			document: documentation,
			documentId: documentData.id,
		});
	} catch (error) {
		console.error("Error in generate-document:", error);
		return Response.json(
			{
				message: "Internal server error",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
