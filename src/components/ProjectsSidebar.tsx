// "use client";

// import React, { useState } from "react";
// import {
//     Sidebar,
//     SidebarContent,
//     SidebarFooter,
//     SidebarGroup,
//     SidebarHeader,
// } from "@/components/ui/sidebar";
// import { ChevronLeft, ChevronRight, Folder, Code2 } from "lucide-react";

// export function ProjectsSidebar() {
//     const [collapsed, setCollapsed] = useState(false);
//     const toggleSidebar = () => setCollapsed((prev) => !prev);

//     return (
//         <Sidebar
//             className={`flex-shrink-0 transition-all duration-300 border-r border-border bg-background 
//       ${collapsed ? "w-16" : "w-64"}`}
//         >
//             {/* HEADER */}
//             <SidebarHeader>
//                 <div className="flex justify-between items-center px-2 w-full">
//                     {!collapsed && (
//                         <div className="flex items-center gap-3">
//                             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
//                                 <Code2 className="h-5 w-5 text-primary-foreground" />
//                             </div>
//                             <div>
//                                 <h1 className="font-mono text-lg font-semibold text-foreground">DocuCode AI</h1>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </SidebarHeader>

//             {/* CONTENT */}
//             <SidebarContent
//                 className={`transition-all duration-300 overflow-hidden 
//                     ${collapsed ? "opacity-0 h-0 pointer-events-none" : "opacity-100 h-auto"}`}
//             >
//                 <SidebarGroup>
//                     <span className="font-bold text-sm truncate">Projects</span>
//                     <div className="flex flex-col gap-1 p-2">
//                         <button className="flex items-center gap-2 p-1 hover:bg-gray-700 rounded">
//                             <Folder className="h-4 w-4" />
//                             {!collapsed && <span>My Project</span>}
//                         </button>
//                     </div>
//                 </SidebarGroup>
//             </SidebarContent>

//             {/* FOOTER */}
//             {!collapsed && (
//                 <SidebarFooter className="transition-all duration-300">
//                     <span className="text-xs text-muted-foreground p-2">Footer</span>
//                 </SidebarFooter>
//             )}
//         </Sidebar>
//     );
// }


"use client"

import { ChevronRight, Folder, FileText, Code2, Plus, User2, ChevronUp } from "lucide-react"
import { useState } from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
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
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type Snippet = {
    id: string
    title: string
    icon: typeof FileText
}

type Project = {
    id: string
    title: string
    icon: typeof Folder
    snippets: Snippet[]
}

export function ProjectsSidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const [projects, setProjects] = useState<Project[]>([])

    const toggleSidebar = () => setCollapsed(prev => !prev)

    const handleCreateProject = () => {
        const projectName = prompt("Nombre del nuevo proyecto:")
        if (projectName && projectName.trim()) {
            const newProject: Project = {
                id: Date.now().toString(),
                title: projectName.trim(),
                icon: Folder,
                snippets: [],
            }
            setProjects([...projects, newProject])
        }
    }

    const handleCreateSnippet = (projectId: string) => {
        const snippetName = prompt("Nombre del nuevo snippet:")
        if (snippetName && snippetName.trim()) {
            setProjects(
                projects.map(project => {
                    if (project.id === projectId) {
                        const newSnippet: Snippet = {
                            id: Date.now().toString(),
                            title: snippetName.trim(),
                            icon: FileText,
                        }
                        return {
                            ...project,
                            snippets: [...project.snippets, newSnippet],
                        }
                    }
                    return project
                })
            )
        }
    }

    return (
        <Sidebar collapsible="icon" className={`transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
            {/* HEADER */}
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton className="p-0">
                        <a className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <Code2 className="h-5 text-primary-foreground" />
                            </span>
                            {!collapsed && (
                                <span className="font-mono text-lg font-semibold">DocuCode AI</span>
                            )}
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                {/* <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a className="flex items-center gap-2 cursor-pointer">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                    <Code2 className="h-5 w-5 text-primary-foreground" />
                                </span>
                                {!collapsed && (
                                    <span className="font-mono text-lg font-semibold">DocuCode AI</span>
                                )}
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu> */}
            </SidebarHeader>

            {/* CONTENT */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Proyectos</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={handleCreateProject} tooltip="Nuevo Proyecto">
                                    <Plus className="h-4 w-4" />
                                    {!collapsed && <span>Nuevo Proyecto</span>}
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {projects.map(project => (
                                <Collapsible key={project.id} asChild defaultOpen={false}>
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={project.title}>
                                                <project.icon />
                                                {!collapsed && <span>{project.title}</span>}
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton onClick={() => handleCreateSnippet(project.id)}>
                                                        <Plus className="h-4 w-4" />
                                                        {!collapsed && <span>Nuevo Snippet</span>}
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>

                                                {project.snippets.map(snippet => (
                                                    <SidebarMenuSubItem key={snippet.id}>
                                                        <SidebarMenuSubButton asChild>
                                                            <a href="#">
                                                                <snippet.icon />
                                                                {!collapsed && <span>{snippet.title}</span>}
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

            {/* FOOTER */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton tooltip="Usuario">
                                    <User2 /> {!collapsed && "Usuario"}
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-(--radix-popper-anchor-width)">
                                <DropdownMenuItem>
                                    <span>Cuenta</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Facturación</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Cerrar sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

