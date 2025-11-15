"use client";
import { useEffect } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { GetProjectDto } from "@/types/project.types";
import { useWorkspace } from "@/context/WorkspaceContext";
import { UserProject } from "./UserProject";
import { NewProjectButton } from "./NewProjectButton";
import { SidebarUserMenu } from "./SidebarUserMenu";
import { Code2, PanelLeftIcon } from "lucide-react";
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
	useSidebar,
	SidebarTrigger,
	SidebarFooter,
} from "@/components/ui/sidebar";

interface ProjectsSidebarProps {
	user: User;
	userProjectsData: GetProjectDto[];
}

export function ProjectsSidebar({ user, userProjectsData }: ProjectsSidebarProps) {
	const router = useRouter();
	const isMobile = useIsMobile();
	const { newDocument } = useWorkspace();
	const { toggleSidebar, open } = useSidebar();

	// Refrescar la página cuando se guarda un documento
	useEffect(() => {
		if (newDocument.document.id && newDocument.document.title && typeof window !== "undefined") {
			const timeoutId = setTimeout(() => {
				router.refresh();
			}, 500);

			return () => clearTimeout(timeoutId);
		}
	}, [newDocument.document.id, newDocument.document.title, router]);

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
								<NewProjectButton />
							</SidebarMenuItem>

							{userProjectsData.map((project) => (
								<UserProject key={project.id} project={project} />
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			{!isMobile && (
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarUserMenu user={user} />
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			)}
		</Sidebar>
	);
}
