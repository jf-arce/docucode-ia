import { GetProjectDto } from "@/types/project.types";
import { createClient } from "@/utils/supabase/server";

export async function getProjectsData(userId: string): Promise<GetProjectDto[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("projects")
		.select("*, documents:documents_project_id_fkey(*, snippet:snippets(*))")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching projects:", error);
		throw error;
	}

	const projectsData: GetProjectDto[] = data.map((project) => ({
		id: project.id,
		name: project.name,
		description: project.description,
		documents: project.documents,
	}));

	return projectsData;
}
