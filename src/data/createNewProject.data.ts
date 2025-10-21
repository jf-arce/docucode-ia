import { GetProjectDto, NewProjectDto } from "@/types/project.types";
import { createClient } from "@/utils/supabase/server";

export async function createNewProjectData(newProjectDto: NewProjectDto) {
	const supabase = await createClient();
	const { name, description, userId } = newProjectDto;

	const { error } = await supabase.from("projects").insert({
		name,
		description,
		user_id: userId,
	});

	if (error) {
		console.error("Error creating new project:", error);
		throw error;
	}
}

export async function getProjectsData(userId: string): Promise<GetProjectDto[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("projects")
		.select("*")
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
	}));

	return projectsData;
}
