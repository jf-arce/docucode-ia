import { FileText } from "lucide-react";
import { NewProjectButton } from "@/components/NewProjectButton";

export const EmptyWorkspace = () => {
	return (
		<div className="flex flex-col flex-1 items-center justify-center gap-6 mb-[70px]">
			<div className="text-center flex flex-col gap-5">
				<div>
					<FileText className="mx-auto h-12 w-12 text-primary/50" />
					<p className="mt-3 text-lg font-normal text-foreground">No document selected</p>
				</div>
				<p className="text-md text-muted-foreground">
					Select an existing document or Create a new project to get started documenting your code.
				</p>
			</div>
			<div>
				<NewProjectButton />
			</div>
		</div>
	);
};
