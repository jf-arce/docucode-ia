"use client";

import { Moon, Sun, Code2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const NavBar = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
			<div className="flex items-center gap-3">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
					<Code2 className="h-5 w-5 text-primary-foreground" />
				</div>
				<div>
					<h1 className="font-mono text-lg font-semibold text-foreground">DocuCode AI</h1>
				</div>
			</div>

			<div className="flex items-center gap-2">
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
		</header>
	);
};
