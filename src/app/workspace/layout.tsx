import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		return redirect("/");
	}

	return <>{children}</>;
}
