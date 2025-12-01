import { createClient } from "@/utils/supabase/server";

export const getGithubRepositoryDocsByUser = async (userId: string) => {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("github_repository_docs")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) return [];

	return data;
};
