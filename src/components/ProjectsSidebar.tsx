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

export function ProjectsSidebar({ user }: { user: User }) {
	const [projects, setProjects] = useState<Project[]>([]);
	const router = useRouter();
	const { toggleSidebar, open } = useSidebar();
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleCreateProject = () => {
		const projectName = prompt("Nombre del nuevo proyecto:");
		if (projectName && projectName.trim()) {
			const newProject: Project = {
				id: Date.now().toString(),
				title: projectName.trim(),
				icon: Folder,
				snippets: [],
			};
			setProjects([...projects, newProject]);
		}
	};

	const handleCreateSnippet = (projectId: string) => {
		const snippetName = prompt("Nombre del nuevo snippet:");
		if (snippetName && snippetName.trim()) {
			setProjects(
				projects.map((project) => {
					if (project.id === projectId) {
						const newSnippet: Snippet = {
							id: Date.now().toString(),
							title: snippetName.trim(),
							icon: FileText,
						};
						return {
							...project,
							snippets: [...project.snippets, newSnippet],
						};
					}
					return project;
				}),
			);
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
								<SidebarMenuButton onClick={handleCreateProject} tooltip="Nuevo Proyecto">
									<Plus className="h-4 w-4" />
									{open && <span>Nuevo Proyecto</span>}
								</SidebarMenuButton>
							</SidebarMenuItem>

							{projects.map((project) => (
								<Collapsible key={project.id} asChild defaultOpen={false}>
									<SidebarMenuItem>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton tooltip={project.title}>
												<project.icon />
												{open && <span>{project.title}</span>}
												<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												<SidebarMenuSubItem>
													<SidebarMenuSubButton onClick={() => handleCreateSnippet(project.id)}>
														<Plus className="h-4 w-4" />
														{open && <span>Nuevo Snippet</span>}
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>

												{project.snippets.map((snippet) => (
													<SidebarMenuSubItem key={snippet.id}>
														<SidebarMenuSubButton asChild>
															<a href="#">
																<snippet.icon />
																{open && <span>{snippet.title}</span>}
															</a>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

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
							<DropdownMenuContent side="top" style={{ width: "var(--radix-popper-anchor-width)" }}>
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
		</Sidebar>
	);
}
