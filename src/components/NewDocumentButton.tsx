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
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { GetProjectDto } from "@/types/project.types";
import { createDocumentAction } from "@/actions/createDocument.action";
import { useRouter } from "next/navigation";

interface NewDocumentButtonProps {
	project: GetProjectDto;
}

export const NewDocumentButton = ({ project }: NewDocumentButtonProps) => {
	const [isDialogOpen, setIsDialogOpen] = useState<{ [key: number]: boolean }>({});
	const { toggleSidebar } = useSidebar();
	const { updateCode, updateDocumentation } = useWorkspace();

	const isMobile = useIsMobile();
	const router = useRouter();
	const [loading, setLoading] = useState(false);

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

		setLoading(true);
		const { error, document } = await createDocumentAction({
			title,
			project_id: projectId,
		});

		if (error || !document) {
			toast.error("Failed to create document", {
				description: error,
				duration: 3000,
			});
			return;
		}

		updateCode("");
		updateDocumentation("");

		router.push(`/workspace/p-${document.project_id}/d/${document.id}`);

		setIsDialogOpen({ ...isDialogOpen, [projectId]: false });
		setLoading(false);

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
						<div className="grid gap-4 mb-3">
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
							<Button type="submit" disabled={loading}>
								{loading ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Creating...
									</>
								) : (
									"Create Document"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};
