export interface Snippet {
    id: string
    name: string
    code: string
    documentation: string
    language: string
    createdAt: string
    updatedAt: string
}

export interface Project {
    id: string
    name: string
    snippets: Snippet[]
    createdAt: string
    updatedAt: string
}