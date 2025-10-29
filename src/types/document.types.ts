export interface Document {
	id: number;
	created_at: string;
	title: string;
	content: string;
	project_id: number;
	snippet_id: number;
}

export type GetDocumentDto = Omit<Document, "created_at" | "snippet_id">;

export type GenerateDocumentationDto = {
	snippet: {
		lenguage: string;
		code: string;
	};
	document: {
		title: string;
		project_id: number;
	};
};
