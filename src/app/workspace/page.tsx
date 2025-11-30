import { WorkspaceBackground } from "@/components/WorkspaceBackground";
import { WorkspaceScreen } from "@/screens/WorkspaceScreen";

export default function WorkspacePage() {
	return (
		<div className="flex h-full flex-col relative">
			<WorkspaceScreen />
			<WorkspaceBackground />
		</div>
	);
}
