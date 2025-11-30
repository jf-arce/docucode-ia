import { NewProjectButton } from "@/components/NewProjectButton";
import { FileTextIcon } from "./Icons";
import { GithubRepoDocStarter } from "./GithubRepoDocStarter";

export const DocumentationStarter = () => {
	return (
		<div className="flex flex-1 items-center justify-center gap-6 mb-[70px]">
			<div className="flex flex-col lg:flex-row gap-4 lg:gap-6 justify-between">
				<GithubRepoDocStarter />

				<div className="flex items-center justify-center">
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
