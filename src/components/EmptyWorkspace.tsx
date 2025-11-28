import { NewProjectButton } from "@/components/NewProjectButton";
import { Input } from "./ui/input";
import { FileTextIcon, GitHubIcon } from "./Icons";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { RepositoriesCombobox } from "./repositories-combobox";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe } from "lucide-react";
import { Separator } from "./ui/separator";

const getUserRepositories = async () => {
	const supabase = createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	const githubToken = session?.provider_token;
	console.log(githubToken);
	if (!githubToken) return [];

	const res = await fetch("https://api.github.com/user/repos", {
		headers: {
			Authorization: `Bearer ${githubToken}`,
		},
	});
	return await res.json();
};

export const EmptyWorkspace = () => {
	const [userRepositories, setUserRepositories] = useState([]);
	const [wasSelectedRepository, setWasSelectedRepository] = useState(false);

	useEffect(() => {
		getUserRepositories().then((repos) => setUserRepositories(repos));
	}, []);

	console.log(userRepositories);

	return (
		<div className="flex flex-1 items-center justify-center gap-6 mb-[70px]">
			<div className="flex flex-col lg:flex-row gap-6 justify-between">
				<div className="max-w-sm flex flex-col gap-4 bg-primary/5 p-6 rounded-lg border border-primary/10">
					<GitHubIcon size={48} />
					<h2 className="text-xl font-medium">Document your code from GitHub</h2>
					<Tabs defaultValue="github" className="bg-background/80 p-4 rounded-lg">
						<TabsList className="flex justify-center bg-black w-full">
							<TabsTrigger value="github" asChild className="flex-1">
								<div>
									<GitHubIcon size={24} />
									My Github
								</div>
							</TabsTrigger>
							<TabsTrigger value="url" asChild className="flex-1">
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
							<div className="mt-4">
								<RepositoriesCombobox
									repositories={userRepositories}
									onSelectRepo={(repo) => setWasSelectedRepository(repo ? true : false)}
								/>
							</div>
						</TabsContent>
						<TabsContent value="url" className="flex flex-col gap-2">
							<div className="flex flex-col gap-2">
								<div className="flex flex-col gap-1">
									<p className="text-md text-muted-foreground">Put a public repository link.</p>
								</div>
							</div>
							<div className="mt-4">
								<Input placeholder="GitHub repository link" />
							</div>
						</TabsContent>
					</Tabs>
					<Button disabled={!wasSelectedRepository}>Document</Button>
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
