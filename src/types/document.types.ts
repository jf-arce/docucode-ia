export interface Snippet {
	id: number;
	code: string;
	language: string;
}

export interface Document {
	id: number;
	created_at: string;
	title: string;
	content: string;
	project_id: number;
	snippet_id: number;
	snippet?: Snippet;
}

export type GetDocumentDto = Omit<Document, "created_at" | "snippet_id">;

export type GenerateSnippetDocumentation = {
	snippet: {
		language: string;
		code: string;
	};
	document: {
		title: string;
		language: string;
	};
};

export type CreateDocument = {
	title: string;
	project_id: number;
	content?: string;
	snippet_id?: number;
};

export type UpdateDocument = Partial<CreateDocument>;
