"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { toast } from "sonner";

export const GoogleLoginButton = () => {
	const supabase = createClient();

	const handleLogin = async () => {
		toast.loading("Logging in with Google...");
		await supabase.auth.signInWithOAuth({
			provider: "google",
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
			<Image src="/icons/google.svg" alt="Google Icon" width={20} height={20} />
			<span>Login with Google</span>
		</Button>
	);
};
