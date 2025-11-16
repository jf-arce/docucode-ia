import { DocumentScreen } from "@/screens/DocumentScreen";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

interface DocumentPageProps {
	params: Promise<{ projectSlug: string; documentId: string }>;
}

export default async function DocumentPage({ params }: DocumentPageProps) {
	const { projectSlug, documentId } = await params;
	const projectLetter = projectSlug.split("-")[0];

	if (projectLetter !== "p") {
		return notFound();
	}
	const projectId = projectSlug.split("-")[1];

	const supabase = await createClient();

	const { error, data: document } = await supabase
		.from("documents")
		.select("*, snippet:snippets(*)")
		.eq("id", parseInt(documentId))
		.eq("project_id", parseInt(projectId))
		.single();

	if (error || !document) {
		return notFound();
	}

	return <DocumentScreen document={document} />;
}
