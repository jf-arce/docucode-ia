export type Project = {
	id: number;
	created_at: string;
	name: string;
	description: string | null;
	updated_at: string;
	userId: string;
};

export type NewProjectDto = Omit<Project, "id" | "created_at" | "updated_at">;

export type GetProjectDto = Omit<Project, "created_at" | "updated_at" | "userId">;
