"use client"

import { User } from "@supabase/supabase-js";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from "./ui/dropdown-menu";

import { createClient } from "@/utils/supabase/client";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useRouter } from "next/navigation";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { LogOut, ChevronUp, User2, Sun, Moon, Computer, HomeIcon, Languages } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SidebarUserMenuProps {
	user: User;
}

export const SidebarUserMenu = ({ user }: SidebarUserMenuProps) => {
	const router = useRouter();
	const { theme, setTheme } = useTheme();
	const { open } = useSidebar();
	const [mounted, setMounted] = useState(false);
	const [language, setLanguage] = useState("English");

	useEffect(() => {
		setMounted(true);
		// Cargar el idioma desde localStorage después del montaje
		const savedLanguage = localStorage.getItem("doc-language");
		if (savedLanguage) {
			setLanguage(savedLanguage);
		}
	}, []);

	useEffect(() => {
		if (mounted) {
			localStorage.setItem("doc-language", language);
		}
	}, [language, mounted]);

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
		<>
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



					<DropdownMenuItem asChild className="cursor-pointer">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="relative w-full justify-start px-2"
								>
									{language === "English" && <span className="fi fi-us fis rounded-full"></span>}
									{language === "Spanish" && <span className="fi fi-es fis rounded-full"></span>}

									<span className="font-normal">Doc Language</span>
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end" side="right">
								<DropdownMenuItem onClick={() => setLanguage("English")}>
									<span className="fi fi-us fis rounded-full"></span>
									<span>English</span>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setLanguage("Spanish")}>
									<span className="fi fi-es fis rounded-full"></span>
									<span>Spanish</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</DropdownMenuItem>

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

					<Link href="/">
						<DropdownMenuItem className="cursor-pointer">
							<HomeIcon className="h-4 w-4" />
							<span>Home</span>
						</DropdownMenuItem>
					</Link>

					<DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
						<LogOut className="h-4 w-4" />
						<span>Logout</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
