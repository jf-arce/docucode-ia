import { UpdateGithubRepositoryDoc } from "@/types/github-repository-docs";
import { createClient } from "@/utils/supabase/client";

//TODO: Implementar que se le pueda pasar una rama diferente a main
export const updateGithubRepositoryDoc = async (id: string, params: UpdateGithubRepositoryDoc) => {
	const supabase = createClient();

	const { error } = await supabase.from("github_repository_docs").update(params).eq("id", id);

	if (error) {
		throw error;
	}
};
