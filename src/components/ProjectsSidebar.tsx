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
import { Code2, PanelLeftIcon, ChevronDown } from "lucide-react";
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
import { GithubRepositoryDoc } from "@/types/github-repository-docs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { FileTextIcon } from "./Icons";

interface ProjectsSidebarProps {
	user: User;
	userProjectsData: GetProjectDto[];
	userRepoDocsData: GithubRepositoryDoc[];
}

export function ProjectsSidebar({
	user,
	userProjectsData,
	userRepoDocsData,
}: ProjectsSidebarProps) {
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
								<Link href="/workspace">
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
				<Collapsible defaultOpen className="group/collapsible">
					<SidebarGroup>
						<SidebarGroupLabel asChild>
							<CollapsibleTrigger>
								Projects
								<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>

						<CollapsibleContent>
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
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>

				<Collapsible defaultOpen className="group/collapsible">
					<SidebarGroup>
						<SidebarGroupLabel asChild>
							<CollapsibleTrigger>
								Repositories
								<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenu>
									{userRepoDocsData.map((repoDoc) => (
										<UserRepoDoc key={repoDoc.id} repoDoc={repoDoc} />
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>
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

export const UserRepoDoc = ({ repoDoc }: { repoDoc: GithubRepositoryDoc }) => {
	return (
		<SidebarMenuItem>
			<SidebarMenuButton className="cursor-pointer w-full" asChild>
				<Link href={`/workspace/repo/${repoDoc.id}`}>
					<FileTextIcon />
					<span>{repoDoc.repo_name}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};
