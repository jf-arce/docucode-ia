import { GithubRepositoryDoc } from "@/types/github-repository-docs";
import { UserGithubRepositoryResponse } from "@/types/user-github-repository-response";
import { createClient } from "@/utils/supabase/client";

export const createGithubRepositoryDoc = async (
	repoSelected: UserGithubRepositoryResponse,
): Promise<GithubRepositoryDoc | null> => {
	const supabase = createClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	const userId = session?.user.id;
	if (!userId) return null;

	const { error, data } = await supabase
		.from("github_repository_docs")
		.insert({
			repo_owner: repoSelected?.owner.login,
			repo_name: repoSelected?.name,
			user_id: userId,
		})
		.select()
		.single();

	if (error || !data) return null;

	return data as GithubRepositoryDoc;
};
