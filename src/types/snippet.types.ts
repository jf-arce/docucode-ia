export type Snippet = {
	id: number;
	created_at: string;
	lenguage: string;
	code: string;
};

export type NewSnippetDto = Omit<Snippet, "id" | "created_at">;

export type GetSnippetDto = Omit<Snippet, "created_at">;
