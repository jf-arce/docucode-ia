"use client";

import { Moon, Sun, Code2, User, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { SidebarTrigger } from "@/components/ui/sidebar";

interface NavBarProps {
	user: SupabaseUser | null;
}

export const NavBar = ({ user }: NavBarProps) => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const isWorkspace = pathname.startsWith("/workspace");

	useEffect(() => {
		setMounted(true);
	}, []);

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
		<header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 md:px-6">
			{!isWorkspace && (
				<div className="flex items-center gap-3">
					<Link href="/" className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
							<Code2 className="h-5 w-5 text-primary-foreground" />
						</div>
						<div>
							<h1 className="font-mono text-lg font-semibold text-foreground">DocuCode AI</h1>
						</div>
					</Link>
				</div>
			)}

			{isWorkspace && <SidebarTrigger />}

			<div className="flex items-center gap-2">
				{user && !isWorkspace && (
					<Button variant="secondary" asChild>
						<Link href="/workspace" className="flex items-center gap-2">
							<Code2 className="h-4 w-4" />
							<span>Workspace</span>
						</Link>
					</Button>
				)}

				<div>
					{mounted && (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							className="h-9 w-9"
						>
							{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
							<span className="sr-only">Toggle theme</span>
						</Button>
					)}
				</div>

				{user ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild className="cursor-pointer">
							<Avatar>
								<AvatarImage src={user?.user_metadata.avatar_url} />
								<AvatarFallback>
									<User className="h-4 w-4" />
								</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>
								<div className="flex flex-col gap-1">
									<span className="text-sm font-medium">
										{user?.user_metadata.display_name || user?.user_metadata.name}
									</span>
									<span className="text-xs text-muted-foreground">{user?.email}</span>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
								<LogOut className="h-4 w-4" />
								<span>Logout</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<div className="flex items-center gap-2 pl-2">
						<Button variant="outline" asChild>
							<Link href="/auth/login">Login</Link>
						</Button>
						<Button variant="default" asChild>
							<Link href="/auth/login?mode=signup">Signup</Link>
						</Button>
					</div>
				)}
			</div>
		</header>
	);
};
