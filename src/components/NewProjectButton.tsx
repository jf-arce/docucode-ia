import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Plus } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { createNewProjectAction } from "@/actions/newProjectForm.action";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Button } from "./ui/button";

export const NewProjectButton = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<SidebarMenuButton tooltip="New Project">
					<>
						<Plus className="h-4 w-4" />
						<span>New Project</span>
					</>
				</SidebarMenuButton>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<form>
					<DialogHeader>
						<DialogTitle>Create new project</DialogTitle>
						<DialogDescription>Create your documentation project.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 mb-3">
						<div className="grid gap-3">
							<Label htmlFor="name">Name</Label>
							<Input id="name" name="name" defaultValue="Project 1" />
						</div>
						<div className="grid gap-3">
							<Label htmlFor="description">Description</Label>
							<Input id="description" name="description" defaultValue="Description" />
						</div>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button formAction={createNewProjectAction} type="submit">
								Save changes
							</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
