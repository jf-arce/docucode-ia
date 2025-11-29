import { Button } from "@/components/ui/button";
import { GithubRepositoryDoc } from "@/types/github-repository-docs";
import { createClient } from "@/utils/supabase/server";
import { Sparkles } from "lucide-react";

import { RepoDocLoader } from "@/components/RepoDocLoader";

interface DocumentPageProps {
	params: Promise<{ repoId: string }>;
}

export default async function RepoDocPreviewPage({ params }: DocumentPageProps) {
	const repoId = (await params).repoId;

	const supabase = await createClient();

	const { data, error } = await supabase
		.from("github_repository_docs")
		.select("*")
		.eq("id", repoId)
		.single();

	const repoDoc = data as GithubRepositoryDoc;

	if (error) return <div>Error al cargar documentación.</div>;

	if (!repoDoc.documentation || !repoDoc.is_generated)
		return <RepoDocLoader githubRepositoryDoc={repoDoc} />;

	return (
		<section className="px-10 py-5">
			<nav className="flex justify-between">
				<h1 className="text-2xl font-bold mb-4">Documentación de {repoDoc.repo_name}</h1>

				<form action={`/docs/${repoId}/document`} method="POST">
					<Button type="submit">
						<Sparkles className="h-4 w-4" />
						Documentar de nuevo
					</Button>
				</form>
			</nav>
		</section>
	);
}
