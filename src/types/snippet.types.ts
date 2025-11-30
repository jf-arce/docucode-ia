export type Snippet = {
	id: number;
	created_at: string;
	language: string;
	code: string;
};

export type NewSnippetDto = Omit<Snippet, "id" | "created_at">;

export type GetSnippetDto = Omit<Snippet, "created_at">;

export type UpdateSnippetDto = Omit<Partial<Snippet>, "id" | "created_at">;
