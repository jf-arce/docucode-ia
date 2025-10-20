import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NavBar } from "@/components/NavBar";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
	const supabase = await createClient();
	const { data } = await supabase.auth.getUser();

	if (data?.user) {
		return redirect("/workspace");
	}

	return (
		<>
			<NavBar user={data?.user} />
			<div className="flex items-center justify-center h-full">{children}</div>
		</>
	);
}
