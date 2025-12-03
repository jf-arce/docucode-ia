import { GithubRepositoryDoc } from "@/types/github-repository-docs";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { RepoDocStatusChecker } from "@/components/RepoDocStatusChecker";
import { RegenerateGithubRepoDocButton } from "@/components/RegenerateGithubRepoDocButton";
import { RepoDocumentationViewer } from "@/components/RepoDocumentationViewer";

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

	if (error) return notFound();

	if (!repoDoc.is_generated) {
		return <RepoDocStatusChecker initialDoc={repoDoc} />;
	}

	const documentationContent = repoDoc.documentation || "";

	return (
		<div className="flex flex-col h-screen overflow-hidden bg-background">
			<header className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0">
				<div className="flex items-center gap-4">
					<Link
						href="/workspace"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="h-5 w-5" />
					</Link>
					<h1 className="text-xl font-bold tracking-tight">Documentation of {repoDoc.repo_name}</h1>
				</div>
				<RegenerateGithubRepoDocButton repoDoc={repoDoc} />
			</header>

			<main className="flex flex-1 overflow-hidden">
				<div className="flex-1 overflow-y-auto">
					<RepoDocumentationViewer
						documentation={documentationContent}
						doc_language={repoDoc.doc_language}
						repoId={repoDoc.id}
					/>
				</div>
			</main>
		</div>

	);
}
