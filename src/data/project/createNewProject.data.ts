import { NewProjectDto } from "@/types/project.types";
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
