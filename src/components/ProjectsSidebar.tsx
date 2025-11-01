"use client";

import {
	ChevronRight,
	Folder,
	FileText,
	Code2,
	Plus,
	PanelLeftIcon,
	LogOut,
	ChevronUp,
	User2,
	Sun,
	Moon,
	Computer,
	Trash2,
	MoreVertical,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarMenuSubButton,
	useSidebar,
	SidebarTrigger,
	SidebarFooter,
} from "@/components/ui/sidebar";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { createNewProjectAction } from "@/actions/newProjectForm.action";
import { createDocumentAction } from "@/actions/createDocument.action";
import { deleteDocumentAction } from "@/actions/deleteDocument.action";
import { deleteProjectAction } from "@/actions/deleteProject.action";
import { GetProjectDto } from "@/types/project.types";
import { useWorkspace } from "@/context/WorkspaceContext";
import { toast } from "sonner";
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

type Snippet = {
	id: string;
	title: string;
	icon: typeof FileText;
};

type Project = {
	id: string;
	title: string;
	icon: typeof Folder;
	snippets: Snippet[];
};

interface ProjectsSidebarProps {
	user: User;
	userProjectsData: GetProjectDto[];
}

export function ProjectsSidebar({ user, userProjectsData }: ProjectsSidebarProps) {
	const [projects, setProjects] = useState<Project[]>([]);
	const router = useRouter();
	const { toggleSidebar, open } = useSidebar();
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();
	const isMobile = useIsMobile();
	const { newDocument, updateNewDocument } = useWorkspace();
	const [isDialogOpen, setIsDialogOpen] = useState<{ [key: number]: boolean }>({});
	const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);
	const [deleteDocumentId, setDeleteDocumentId] = useState<number | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

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

		// Cerrar el diálogo inmediatamente
		setIsDialogOpen({ ...isDialogOpen, [projectId]: false });

		// Mostrar toast de carga
		toast.loading("Creating document...", { id: "create-doc" });

		try {
			// Crear el documento en la base de datos
			const result = await createDocumentAction(title, projectId);

			if (!result.success) {
				throw new Error(result.error || "Failed to create document");
			}

			// Actualizar el contexto con el nuevo documento
			updateNewDocument({
				snippet: {
					lenguage: "typescript",
					code: "",
				},
				document: {
					title: title,
					project_id: projectId,
				},
			});

			// Cerrar el toast de carga y mostrar éxito
			toast.success("Document created", {
				id: "create-doc",
				description: `"${title}" is ready to be edited.`,
				duration: 3000,
			});

			// Refrescar los datos del servidor para actualizar la lista de documentos
			router.refresh();

			// Si es móvil, cerrar el sidebar
			if (isMobile) {
				toggleSidebar();
			}
		} catch (error) {
			console.error("Error creating document:", error);
			toast.error("Failed to create document", {
				id: "create-doc",
				description: error instanceof Error ? error.message : "Please try again.",
				duration: 3000,
			});
		}
	};

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
					snippet: { lenguage: "", code: "" },
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

			// Si el documento eliminado es el actual, limpiar el contexto
			if (newDocument.document.id === deleteDocumentId) {
				updateNewDocument({
					snippet: { lenguage: "", code: "" },
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

	const handleLogout = async () => {
		await createClient()
			.auth.signOut()
			.then(() => {
				router.push("/");
				router.refresh();
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenuItem className="flex items-center gap-2 justify-between">
					{open ? (
						<>
							<SidebarMenuButton className="cursor-pointer w-fit" asChild>
								<Link href="/">
									<Code2 className="text-primary" />
								</Link>
							</SidebarMenuButton>

							<SidebarTrigger />
						</>
					) : (
						<SidebarMenuButton className="cursor-pointer w-fit group/panel" onClick={toggleSidebar}>
							<Code2 className="text-primary group-hover/panel:hidden transition-all" />

							<PanelLeftIcon className="group-hover/panel:block hidden transition-all" />
						</SidebarMenuButton>
					)}
				</SidebarMenuItem>
			</SidebarHeader>

			<SidebarContent className="overflow-hidden">
				<SidebarGroup>
					<SidebarGroupLabel>Proyectos</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
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
											<div className="grid gap-4">
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
							</SidebarMenuItem>

							{userProjectsData.map((project) => (
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
																	<DialogDescription>
																		Create a new document in {project.name}
																	</DialogDescription>
																</DialogHeader>
																<div className="grid gap-4">
																	<div className="grid gap-3">
																		<Label htmlFor="title">Title</Label>
																		<Input
																			id="title"
																			name="title"
																			placeholder="Document name"
																			autoFocus
																		/>
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
												</SidebarMenuSubItem>

												{project.documents && project.documents.length > 0 && (
													project.documents.map((document) => (
														<SidebarMenuSubItem key={document.id}>
															<div className="flex items-center w-full group/document">
																<SidebarMenuSubButton
																	asChild
																	className="flex-1"
																	onClick={() => {
																		updateNewDocument({
																			snippet: {
																				lenguage: document.snippet?.lenguage || "typescript",
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
																		<FileText className="h-4 w-4 flex-shrink-0" />
																		{open && <span className="truncate">{document.title}</span>}
																	</div>
																</SidebarMenuSubButton>
																{open && (
																	<Button
																		variant="ghost"
																		size="sm"
																		className="h-6 w-6 p-0 opacity-0 group-hover/document:opacity-100 transition-opacity flex-shrink-0"
																		onClick={(e) => {
																			e.stopPropagation();
																			setDeleteDocumentId(document.id);
																		}}
																	>
																		<Trash2 className="h-3 w-3 text-destructive" />
																	</Button>
																)}
															</div>
														</SidebarMenuSubItem>
													))
												)}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			{!isMobile && (
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton
										size="lg"
										className={`cursor-pointer ${open ? "justify-start" : "justify-center"}`}
									>
										<Avatar className={`${open ? "size-7" : "size-7"}`}>
											<AvatarImage src={user?.user_metadata.avatar_url} />
											<AvatarFallback>
												<User2 className="h-4 w-4" />
											</AvatarFallback>
										</Avatar>

										{open && (
											<>
												<span className="truncate ">
													{user?.user_metadata.display_name || user?.user_metadata.name}{" "}
												</span>
												<ChevronUp className="ml-auto" />
											</>
										)}
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									side="top"
									style={{ width: "var(--radix-popper-anchor-width)" }}
								>
									<DropdownMenuLabel>
										<div className="flex gap-2 items-center">
											{open && <User2 className="h-4 w-4 text-muted-foreground" />}
											<span className="text-xs text-muted-foreground truncate">{user?.email}</span>
										</div>
									</DropdownMenuLabel>

									<DropdownMenuSeparator />

									{mounted && (
										<DropdownMenuItem asChild className="cursor-pointer">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="relative w-full justify-start px-2"
													>
														{theme === "dark" && <Moon className="text-muted-foreground" />}
														{theme === "light" && <Sun className="text-muted-foreground" />}
														{theme === "system" && <Computer className="text-muted-foreground" />}

														<span className="font-normal">Theme</span>
													</Button>
												</DropdownMenuTrigger>

												<DropdownMenuContent align="end" side="right">
													<DropdownMenuItem onClick={() => setTheme("light")}>
														<Sun className="mr-2 h-4 w-4" />
														<span>Light</span>
													</DropdownMenuItem>
													<DropdownMenuItem onClick={() => setTheme("dark")}>
														<Moon className="mr-2 h-4 w-4" />
														<span>Dark</span>
													</DropdownMenuItem>
													<DropdownMenuItem onClick={() => setTheme("system")}>
														<Computer className="mr-2 h-4 w-4" />
														<span>System</span>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</DropdownMenuItem>
									)}

									<DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
										<LogOut className="h-4 w-4" />
										<span>Logout</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			)}

			{/* Alert Dialog para eliminar proyecto */}
			<AlertDialog open={deleteProjectId !== null} onOpenChange={() => setDeleteProjectId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Project</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this project? This will permanently delete the
							project and all of its documents. This action cannot be undone.
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

			{/* Alert Dialog para eliminar documento */}
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
		</Sidebar>
	);
}
