import { FileText } from "lucide-react";
import { NewProjectButton } from "@/components/NewProjectButton";

export default function WorkspacePage() {
	return (
		<div className="flex h-full flex-col">
			<div className="flex flex-col flex-1 items-center justify-center gap-6">
				<div className="text-center flex flex-col gap-5">
					<div>
						<FileText className="mx-auto h-16 w-16 text-muted-foreground/50" />
						<p className="mt-3 text-2xl font-medium text-foreground">No document selected</p>
					</div>
					<p className="text-md text-muted-foreground">
						Select an existing document or Create a new project to get started documenting your
						code.
					</p>
				</div>
				<div>
					<NewProjectButton />
				</div>
			</div>
		</div>
	);
}
