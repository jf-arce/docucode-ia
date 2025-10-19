"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

export const GoogleLoginButton = () => {
	const supabase = createClient();

	const handleLogin = async () => {
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
			className="w-full flex items-center justify-center gap-2"
		>
			<Image src="/icons/google.svg" alt="Google Icon" width={20} height={20} />
			<span>Login with Google</span>
		</Button>
	);
};
