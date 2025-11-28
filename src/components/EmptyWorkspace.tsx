import { NewProjectButton } from "@/components/NewProjectButton";
import { Input } from "./ui/input";
import { FileTextIcon, GitHubIcon } from "./Icons";
import { Suspense, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { GitHubRepository, RepositoriesCombobox } from "./repositories-combobox";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Sparkles } from "lucide-react";
import { Separator } from "./ui/separator";

const getUserRepositories = async () => {
	const supabase = createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) return [];

	const providerToken = session.provider_token;

	const { data: user } = await supabase
		.from("user_profiles")
		.select("github_token")
		.eq("id", session.user.id)
		.single();

	let tokenToUse = user?.github_token;

	if (providerToken && providerToken !== user?.github_token) {
		// actualizar si hay uno nuevo
		await supabase
			.from("user_profiles")
			.update({ github_token: providerToken })
			.eq("id", session.user.id);

		tokenToUse = providerToken;
	}

	if (!tokenToUse) return [];

	const res = await fetch("https://api.github.com/user/repos", {
		headers: { Authorization: `Bearer ${tokenToUse}` },
	});

	return res.ok ? res.json() : [];
};

export const EmptyWorkspace = () => {
	const [userRepositories, setUserRepositories] = useState([]);
	const [selectedTab, setSelectedTab] = useState<"github" | "url">("github");
	const [repoSelected, setRepoSelected] = useState<GitHubRepository | null>(null);
	const [urlSelected, setUrlSelected] = useState<string | null>(null);

	useEffect(() => {
		getUserRepositories()
			.then((repos) => setUserRepositories(repos))
			.catch(() => setUserRepositories([]));
	}, []);

	console.log(userRepositories);

	const handleSelectRepo = () => {
		if (selectedTab === "github") {
			console.log(repoSelected);
		} else {
			console.log(urlSelected);
		}
	};

	return (
		<div className="flex flex-1 items-center justify-center gap-6 mb-[70px]">
			<div className="flex flex-col lg:flex-row gap-6 justify-between">
				<div className="max-w-sm flex flex-col gap-4 bg-primary/5 p-6 rounded-lg border border-primary/10">
					<GitHubIcon size={48} />
					<h2 className="text-xl font-medium">Document your code from GitHub</h2>
					<Tabs defaultValue="github" className="bg-background/80 p-4 rounded-lg">
						<TabsList className="flex justify-center bg-black w-full">
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
						<Button disabled={!repoSelected} onClick={handleSelectRepo}>
							<Sparkles className="h-4 w-4" />
							Document
						</Button>
					) : (
						<Button disabled={!urlSelected} onClick={handleSelectRepo}>
							<Sparkles className="h-4 w-4" />
							Document
						</Button>
					)}
				</div>

				<div className="flex items-center">
					<p className="text-lg font-medium">or</p>
				</div>

				<div className="flex flex-col gap-6 max-w-sm bg-primary/5 p-6 rounded-lg border border-primary/10">
					<div className="flex flex-col gap-2">
						<FileTextIcon size={48} className="text-primary/50" />
						<p className="text-xl font-medium text-foreground">Create a new project</p>

						<p className="text-md text-muted-foreground">
							Create a new project and then create a new document to start documenting your code.
						</p>
					</div>
					<div>
						<NewProjectButton />
					</div>
				</div>
			</div>
		</div>
	);
};
