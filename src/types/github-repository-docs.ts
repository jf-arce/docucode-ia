export type GithubRepositoryDoc = {
	id: string;
	repo_owner: string;
	repo_name: string;
	documentation: string | null;
	is_generated: boolean;
	user_id: string;
	created_at: string;
	updated_at: string;
};

export type UpdateGithubRepositoryDoc = Omit<
	Partial<GithubRepositoryDoc>,
	"created_at" | "updated_at"
>;
