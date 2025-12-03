"use client";

import { useEffect, useState } from "react";
import { RepositoriesCombobox } from "./repositories-combobox";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Loader2Icon, Sparkles } from "lucide-react";
import { Separator } from "./ui/separator";
import { useRouter } from "next/navigation";
import { UserGithubRepositoryResponse } from "@/types/user-github-repository-response";
import { getUserRepositories } from "@/services/get-user-repositories";
import { createGithubRepositoryDoc } from "@/data/github-repository-doc/create-github-repository-doc";
import { generateGitHubRepositoryDocumentation } from "@/services/generate-github-documentation";
import { updateGithubRepositoryDoc } from "@/data/github-repository-doc/update-github-repository-doc";
import { Input } from "./ui/input";
import { GitHubIcon } from "./Icons";

export const GithubRepoDocStarter = () => {
	const router = useRouter();
	const [userRepositories, setUserRepositories] = useState([]);
	const [selectedTab, setSelectedTab] = useState<"github" | "url">("github");
	const [repoSelected, setRepoSelected] = useState<UserGithubRepositoryResponse | null>(null);
	const [urlSelected, setUrlSelected] = useState<string | null>(null);
	const [repositoriesLoading, setRepositoriesLoading] = useState(true);
	const [createRepoDocLoading, setCreateRepoDocLoading] = useState(false);
	const [docLanguage, setDocLanguage] = useState("english");

	useEffect(() => {
		getUserRepositories()
			.then((repos) => setUserRepositories(repos))
			.catch(() => setUserRepositories([]))
			.finally(() => setRepositoriesLoading(false));
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const savedLanguage = localStorage.getItem("doc-language");
			if (savedLanguage) {
				setDocLanguage(savedLanguage.toLowerCase());
			}
		}
	}, []);

	const handleSelectRepo = async () => {
		if (selectedTab === "github" && repoSelected) {
			setCreateRepoDocLoading(true);
			const repoDoc = await createGithubRepositoryDoc(repoSelected);
			if (!repoDoc) return;

			router.push(`/workspace/repo/${repoDoc.id}`);

			setCreateRepoDocLoading(false);

			generateGitHubRepositoryDocumentation(repoSelected.html_url, docLanguage)
				.then(async (documentation) => {
					await updateGithubRepositoryDoc(repoDoc.id, { documentation, is_generated: true });
				})
				.catch((err) => {
					console.error("Error generating documentation", err);
				});
		} else {
			console.log(urlSelected);
		}
	};

	return (
		<div className="max-w-sm flex flex-col gap-4 bg-primary/5 p-6 rounded-lg border border-primary/10">
			<GitHubIcon size={48} />
			<h2 className="text-xl font-medium">Document your code from GitHub</h2>
			<Tabs defaultValue="github" className="bg-background/80 p-4 rounded-lg">
				<TabsList className="flex justify-center dark:bg-black/60 bg-gray-200/60 w-full">
					<TabsTrigger value="github" asChild onClick={() => setSelectedTab("github")}>
						<div>
							<GitHubIcon size={24} />
							My Github
						</div>
					</TabsTrigger>
					<TabsTrigger value="url" asChild onClick={() => setSelectedTab("url")}>
						<div>
							<Globe size={24} />
							From GitHub
						</div>
					</TabsTrigger>
				</TabsList>

				<Separator className="my-2" />

				<TabsContent value="github" className="flex flex-col gap-2">
					<div className="flex flex-col gap-2">
						<div className="flex flex-col gap-1">
							<p className="text-md text-muted-foreground">Choose one of your repositories.</p>
						</div>
					</div>
					<div className="mt-2">
						<RepositoriesCombobox
							repoSelected={repoSelected}
							repositories={userRepositories}
							loading={repositoriesLoading}
							onSelectRepo={(repo) => setRepoSelected(repo)}
						/>
					</div>
				</TabsContent>
				<TabsContent value="url" className="flex flex-col gap-2">
					<div className="flex flex-col gap-2">
						<div className="flex flex-col gap-1">
							<p className="text-md text-muted-foreground">Put a public repository link.</p>
						</div>
					</div>
					<div className="mt-2">
						<Input
							placeholder="GitHub repository link"
							value={urlSelected || ""}
							onChange={(e) => setUrlSelected(e.target.value)}
						/>
					</div>
				</TabsContent>
			</Tabs>
			{selectedTab === "github" ? (
				<Button disabled={!repoSelected || createRepoDocLoading} onClick={handleSelectRepo}>
					{createRepoDocLoading ? (
						<Loader2Icon className="h-4 w-4 animate-spin" />
					) : (
						<Sparkles className="h-4 w-4" />
					)}
					Document
				</Button>
			) : (
				<Button disabled={!urlSelected} onClick={handleSelectRepo}>
					<Sparkles className="h-4 w-4" />
					Document
				</Button>
			)}
		</div>
	);
};
