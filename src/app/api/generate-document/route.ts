import { NextRequest } from "next/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
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
					// {
					// 	type: "file",
					// 	data: fs.readFileSync("./data/ai.pdf"),
					// 	mediaType: "application/pdf",
					// },
				],
			},
		],
	});

	/*

        guardar en la base de datos el documento generado y el resto de los datos
    
    */

	return Response.json({
		message: "Document generated successfully",
		document: documentation,
	});
}
