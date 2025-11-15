import { useWorkspace } from "@/context/WorkspaceContext";
import { SidebarMenuButton, useSidebar } from "./ui/sidebar";
import { FileText, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Document } from "@/types/document.types";
import { GetProjectDto } from "@/types/project.types";
import { useIsMobile } from "@/hooks/use-mobile";
import { deleteDocumentAction } from "@/actions/deleteDocument.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./ui/alert-dialog";
import { useState } from "react";

interface ProjectDocumentProps {
	document: Document;
	project: GetProjectDto;
}

export const ProjectDocument = ({ document, project }: ProjectDocumentProps) => {
	const router = useRouter();
	const isMobile = useIsMobile();
	const { open, toggleSidebar } = useSidebar();
	const { newDocument, updateNewDocument, updateDocumentation, updateCode } = useWorkspace();
	const [deleteDocumentId, setDeleteDocumentId] = useState<number | null>(null);

	const handleDeleteDocument = async () => {
		if (!deleteDocumentId) return;

		toast.loading("Deleting document...", { id: "delete-document" });

		try {
			const result = await deleteDocumentAction(deleteDocumentId);

			if (!result.success) {
				throw new Error(result.error || "Failed to delete document");
			}

			toast.success("Document deleted", {
				id: "delete-document",
				description: "Document has been deleted.",
				duration: 3000,
			});

			// Si el documento eliminado es el documento actual, limpiar el contexto
			if (newDocument.document.id === deleteDocumentId) {
				updateNewDocument({
					snippet: { language: "", code: "" },
					document: { title: "", project_id: 0 },
				});
			}

			router.refresh();
		} catch (error) {
			console.error("Error deleting document:", error);
			toast.error("Failed to delete document", {
				id: "delete-document",
				description: error instanceof Error ? error.message : "Please try again.",
				duration: 3000,
			});
		} finally {
			setDeleteDocumentId(null);
		}
	};

	const handleDocumentClick = () => {
		updateDocumentation(document.content || "");
		updateCode(document.snippet?.code || "");
	};

	return (
		<>
			<div className="flex items-center w-full group/document gap-3" onClick={handleDocumentClick}>
				<SidebarMenuButton
					asChild
					className={`flex-1 ${
						newDocument.document.id === document.id ? "bg-accent text-accent-foreground" : ""
					}`}
					onClick={() => {
						updateNewDocument({
							snippet: {
								language: document.snippet?.lenguage || "typescript",
								code: document.snippet?.code || "",
							},
							document: {
								id: document.id,
								title: document.title,
								project_id: project.id,
								content: document.content || "",
							},
						});
						if (isMobile) {
							toggleSidebar();
						}
					}}
				>
					<div className="flex items-center gap-2 cursor-pointer w-full">
						<FileText className="h-4 w-4 shrink-0" />
						{open && <span className="truncate">{document.title}</span>}
					</div>
				</SidebarMenuButton>
				{open && (
					<Button
						variant="ghost"
						size="sm"
						className="h-6 w-6 p-0 opacity-0 group-hover/document:opacity-100 transition-opacity shrink-0"
						onClick={(e) => {
							e.stopPropagation();
							setDeleteDocumentId(document.id);
						}}
					>
						<Trash2 className="h-3 w-3 text-destructive" />
					</Button>
				)}
			</div>

			<AlertDialog open={deleteDocumentId !== null} onOpenChange={() => setDeleteDocumentId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Document</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this document? This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteDocument}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
