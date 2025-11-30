import { Code2Icon } from "lucide-react";
import { WorkspaceBackground } from "@/components/WorkspaceBackground";
import { DocumentationStarter } from "@/components/DocumentationStarter";

export default function WorkspacePage() {
	return (
		<div className="flex h-full flex-col relative">
			<div className="flex flex-col items-center justify-center flex-1 gap-1 sm:gap-4">
				<div className="flex flex-col sm:flex-row items-center gap-2 py-4">
					<h1 className="text-md font-medium text-center">Welcome to DocuCode AI</h1>
					<Code2Icon className="mx-auto text-primary/50 size-5" />
				</div>
				<div className="px-4">
					<DocumentationStarter />
				</div>
			</div>
			<WorkspaceBackground />
		</div>
	);
}
