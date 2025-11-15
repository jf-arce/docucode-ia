import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { GetProjectDto } from "@/types/project.types";

interface NewDocumentButtonProps {
	project: GetProjectDto;
}

export const NewDocumentButton = ({ project }: NewDocumentButtonProps) => {
	const [isDialogOpen, setIsDialogOpen] = useState<{ [key: number]: boolean }>({});
	const { toggleSidebar } = useSidebar();
	const { updateNewDocument, updateCode, updateDocumentation } = useWorkspace();
	const isMobile = useIsMobile();

	const handleSubmit = async (e: React.FormEvent, projectId: number) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const title = formData.get("title") as string;

		if (!title.trim()) {
			toast.error("Title required", {
				description: "Please enter a document title.",
				duration: 3000,
			});
			return;
		}

		const codeLenguage = localStorage.getItem("editor-language") || "typescript";
		updateNewDocument({
			snippet: {
				language: codeLenguage,
				code: "",
			},
			document: {
				title: title,
				project_id: projectId,
				content: "",
			},
		});

		updateCode("");
		updateDocumentation("");

		setIsDialogOpen({ ...isDialogOpen, [projectId]: false });

		if (isMobile) {
			toggleSidebar();
		}
	};

	return (
		<>
			<Dialog
				open={isDialogOpen[project.id] ?? false}
				onOpenChange={(open) => setIsDialogOpen({ ...isDialogOpen, [project.id]: open })}
			>
				<DialogTrigger asChild>
					<SidebarMenuButton tooltip="New Document">
						<>
							<Plus className="h-4 w-4" />
							<span>New Document</span>
						</>
					</SidebarMenuButton>
				</DialogTrigger>

				<DialogContent className="sm:max-w-[425px]">
					<form onSubmit={(e) => handleSubmit(e, project.id)}>
						<DialogHeader>
							<DialogTitle>Create new document</DialogTitle>
							<DialogDescription>Create a new document in {project.name}</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4">
							<div className="grid gap-3">
								<Label htmlFor="title">Title</Label>
								<Input id="title" name="title" placeholder="Document name" autoFocus />
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								type="button"
								onClick={() => setIsDialogOpen({ ...isDialogOpen, [project.id]: false })}
							>
								Cancel
							</Button>
							<Button type="submit">Create Document</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};
