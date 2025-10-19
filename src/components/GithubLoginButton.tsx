"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { toast } from "sonner";

export const GithubLoginButton = () => {
	const supabase = createClient();
	const { theme } = useTheme();
	const githubIcon = theme === "dark" ? "/icons/github_dark.svg" : "/icons/github_light.svg";

	const handleLogin = async () => {
		toast.loading("Logging in with GitHub...");
		await supabase.auth.signInWithOAuth({
			provider: "github",
			options: {
				redirectTo: `${location.origin}/auth/callback?next=/workspace`,
			},
		});
	};

	return (
		<Button
			variant="outline"
			onClick={handleLogin}
			className="w-full sm:w-auto flex flex-1 items-center justify-center gap-2"
		>
			<picture>
				<Image src={githubIcon} alt="GitHub Icon" width={20} height={20} />
			</picture>
			<span>Login with GitHub</span>
		</Button>
	);
};
