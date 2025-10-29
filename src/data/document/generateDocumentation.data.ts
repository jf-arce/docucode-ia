import { GenerateDocumentationDto } from "@/types/document.types";
import { createClient } from "@/utils/supabase/server";

export async function generateDocumentationData(newDocumentXsnippetDto: GenerateDocumentationDto) {
	const supabase = await createClient();

	const { error, data } = await supabase.functions.invoke("generate-documentation", {
		body: newDocumentXsnippetDto,
	});

	if (error || !data) {
		console.error("Error creating new document:", error);
		throw error;
	}

	// return data;
	console.log(data);
}
