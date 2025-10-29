import { GetDocumentDto } from "@/types/document.types";
import { createClient } from "@/utils/supabase/server";

export async function getDocumentsData(userId: string): Promise<GetDocumentDto[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("documents")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching projects:", error);
		throw error;
	}

	const documentsData: GetDocumentDto[] = data.map((document) => ({
		id: document.id,
		title: document.title,
		content: document.content,
		project_id: document.project_id,
	}));

	return documentsData;
}
