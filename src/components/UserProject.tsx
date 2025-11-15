import { GetProjectDto } from "@/types/project.types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useRouter } from "next/navigation";
import { deleteProjectAction } from "@/actions/deleteProject.action";
import { NewDocumentButton } from "./NewDocumentButton";
import { ProjectDocument } from "./ProjectDocument";
import { UnsavedProjectDocument } from "./UnsavedProjectDocument";
import {
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "./ui/dropdown-menu";
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

interface UserProjectsProps {
	project: GetProjectDto;
}

export const UserProject = ({ project }: UserProjectsProps) => {
	const router = useRouter();
	const { open } = useSidebar();
	const { newDocument, updateNewDocument } = useWorkspace();
	const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);

	const handleDeleteProject = async () => {
		if (!deleteProjectId) return;

		toast.loading("Deleting project...", { id: "delete-project" });

		try {
			const result = await deleteProjectAction(deleteProjectId);

			if (!result.success) {
				throw new Error(result.error || "Failed to delete project");
			}

			toast.success("Project deleted", {
				id: "delete-project",
				description: "Project and all its documents have been deleted.",
				duration: 3000,
			});

			// Si el proyecto eliminado contenía el documento actual, limpiar el contexto
			if (newDocument.document.project_id === deleteProjectId) {
				updateNewDocument({
					snippet: { language: "", code: "" },
					document: { title: "", project_id: 0 },
				});
			}

			router.refresh();
		} catch (error) {
			console.error("Error deleting project:", error);
			toast.error("Failed to delete project", {
				id: "delete-project",
				description: error instanceof Error ? error.message : "Please try again.",
				duration: 3000,
			});
		} finally {
			setDeleteProjectId(null);
		}
	};

	return (
		<>
			<Collapsible key={project.id} asChild defaultOpen={false}>
				<SidebarMenuItem>
					<div className="flex items-center w-full group/project">
						<CollapsibleTrigger asChild>
							<SidebarMenuButton tooltip={project.name} className="flex-1">
								{open && <span>{project.name}</span>}
								<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
							</SidebarMenuButton>
						</CollapsibleTrigger>
						{open && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0 opacity-0 group-hover/project:opacity-100 transition-opacity"
									>
										<MoreVertical className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										onClick={() => setDeleteProjectId(project.id)}
										className="text-destructive focus:text-destructive"
									>
										<Trash2 className="mr-2 h-4 w-4" />
										Delete Project
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
					<CollapsibleContent>
						<SidebarMenuSub>
							<SidebarMenuSubItem>
								<NewDocumentButton project={project} />
							</SidebarMenuSubItem>

							{project.documents &&
								project.documents.length > 0 &&
								project.documents.map((document) => (
									<SidebarMenuSubItem key={document.id}>
										<ProjectDocument document={document} project={project} />
									</SidebarMenuSubItem>
								))}

							{newDocument.document.title &&
								newDocument.document.project_id === project.id &&
								!newDocument.document.id && (
									<SidebarMenuSubItem>
										<UnsavedProjectDocument />
									</SidebarMenuSubItem>
								)}
						</SidebarMenuSub>
					</CollapsibleContent>
				</SidebarMenuItem>
			</Collapsible>

			<AlertDialog open={deleteProjectId !== null} onOpenChange={() => setDeleteProjectId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Project</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this project? This will permanently delete the project
							and all of its documents. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteProject}
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
