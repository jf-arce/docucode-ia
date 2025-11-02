export interface Snippet {
	id: number;
	code: string;
	lenguage: string;
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

export type GenerateDocumentation = {
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
	snippet: {
		language: string;
		code: string;
	};
	document: {
		title: string;
		project_id: number;
		content: string;
	};
};
