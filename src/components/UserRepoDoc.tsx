import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { GithubRepositoryDoc } from "@/types/github-repository-docs";
import { SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { FileTextIcon } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { deleteRepoDocAction } from "@/actions/deleteRepoDoc.action";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export const UserRepoDoc = ({ repoDoc }: { repoDoc: GithubRepositoryDoc }) => {
	const { open } = useSidebar();
	const router = useRouter();
	const [deleteRepoDocId, setDeleteRepoDocId] = useState<string | null>(null);

	const handleDeleteDocument = async () => {
		if (!deleteRepoDocId) return;

		toast.loading("Deleting document...", { id: "delete-document" });

		try {
			const result = await deleteRepoDocAction(deleteRepoDocId);

			if (!result.success) {
				throw new Error(result.error || "Failed to delete document");
			}

			toast.success("Document deleted", {
				id: "delete-document",
				description: "Document has been deleted.",
				duration: 3000,
			});

			router.push(`/workspace`);
		} catch (error) {
			console.error("Error deleting document:", error);
			toast.error("Failed to delete document", {
				id: "delete-document",
				description: error instanceof Error ? error.message : "Please try again.",
				duration: 3000,
			});
		} finally {
			setDeleteRepoDocId(null);
		}
	};

	return (
		<SidebarMenuItem>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="flex items-center w-full group/document gap-3">
						<SidebarMenuButton className="cursor-pointer w-full" asChild>
							<Link href={`/workspace/repo/${repoDoc.id}`}>
								<FileTextIcon />
								<span>{repoDoc.repo_name}</span>
							</Link>
						</SidebarMenuButton>

						{open && (
							<Button
								variant="ghost"
								size="sm"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									setDeleteRepoDocId(repoDoc.id);
								}}
								className="h-6 w-6 p-0 mr-1.5 opacity-0 group-hover/document:opacity-100 transition-opacity shrink-0"
							>
								<Trash2 className="h-3 w-3 text-destructive" />
							</Button>
						)}
					</div>
				</TooltipTrigger>
				<TooltipContent side="left" className="max-w-xs">
					<p className="truncate">{repoDoc.repo_name}</p>
				</TooltipContent>
			</Tooltip>

			<AlertDialog open={deleteRepoDocId !== null} onOpenChange={() => setDeleteRepoDocId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Repository Documentation</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this repository documentation? This action cannot be
							undone.
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
		</SidebarMenuItem>
	);
};
