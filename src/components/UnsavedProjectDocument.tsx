import { useWorkspace } from "@/context/WorkspaceContext";
import { SidebarMenuButton, useSidebar } from "./ui/sidebar";
import { FileText, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const UnsavedProjectDocument = () => {
	const isMobile = useIsMobile();
	const { open, toggleSidebar } = useSidebar();
	const { newDocument, updateNewDocument } = useWorkspace();

	return (
		<div className="flex items-center w-full group/document">
			<SidebarMenuButton
				className="flex-1 bg-accent text-accent-foreground"
				onClick={() => {
					if (isMobile) {
						toggleSidebar();
					}
				}}
			>
				<div className="flex items-center gap-2 cursor-pointer w-full">
					<FileText className="h-4 w-4 shrink-0" />
					{open && <span className="truncate italic">{newDocument.document.title} (unsaved)</span>}
				</div>
			</SidebarMenuButton>
			{open && (
				<Button
					variant="ghost"
					size="sm"
					className="h-6 w-6 p-0 opacity-0 group-hover/document:opacity-100 transition-opacity shrink-0"
					onClick={(e) => {
						e.stopPropagation();
						updateNewDocument({
							snippet: { language: "", code: "" },
							document: { title: "", project_id: 0 },
						});
					}}
				>
					<Trash2 className="h-3 w-3 text-destructive" />
				</Button>
			)}
		</div>
	);
};
