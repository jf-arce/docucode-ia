import { NewProjectButton } from "@/components/NewProjectButton";
import { Input } from "./ui/input";
import { FileTextIcon, GitHubIcon } from "./Icons";

export const EmptyWorkspace = () => {
	return (
		<div className="flex flex-1 items-center justify-center gap-6 mb-[70px]">
			<div className="flex flex-col lg:flex-row gap-6 justify-between">
				<div className="max-w-sm flex flex-col gap-4 bg-primary/5 p-6 rounded-lg border border-primary/10">
					<div className="flex flex-col gap-2">
						<GitHubIcon size={48} />
						<h2 className="text-xl font-medium">Document your repository from GitHub</h2>
						<p className="text-md text-muted-foreground">
							Put your repository link and let DocuCode AI document your code
						</p>
					</div>
					<Input placeholder="GitHub repository link" />
				</div>

				<div className="flex items-center">
					<p className="text-lg font-medium">or</p>
				</div>

				<div className="flex flex-col justify-between gap-6 max-w-sm bg-primary/5 p-6 rounded-lg border border-primary/10">
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
