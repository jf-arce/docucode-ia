"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GithubRepositoryDoc } from "@/types/github-repository-docs";
import { generateGitHubRepositoryDocumentation } from "@/services/generate-github-documentation";
import { updateGithubRepositoryDoc } from "@/data/github-repository-doc/update-github-repository-doc";

export const RegenerateGithubRepoDocButton = ({ repoDoc }: { repoDoc: GithubRepositoryDoc }) => {
	const router = useRouter();
	const [isGenerating, setIsGenerating] = useState(false);

	const handleRegenerateDocumentation = async () => {
		setIsGenerating(true);
		const html_url = `https://github.com/${repoDoc.repo_owner}/${repoDoc.repo_name}`;

		try {
			await updateGithubRepositoryDoc(repoDoc.id, { is_generated: false });
			router.refresh();
			const documentation = await generateGitHubRepositoryDocumentation(
				html_url,
				repoDoc.doc_language,
			);
			await updateGithubRepositoryDoc(repoDoc.id, { documentation, is_generated: true });
		} catch (err) {
			console.error("Error generating documentation", err);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<Button
			onClick={handleRegenerateDocumentation}
			variant="default"
			className="gap-2"
			disabled={isGenerating}
		>
			{isGenerating ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<Sparkles className="h-4 w-4" />
			)}
			Regenerate Documentation
		</Button>
	);
};
