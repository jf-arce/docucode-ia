import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProjectsSidebar } from "@/components/ProjectsSidebar";
// import { NavBar } from "@/components/NavBar";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		return redirect("/");
	}

	return (
		<div className="flex">
			<div className="relative">
				<ProjectsSidebar user={data?.user} />
			</div>
			<div className="flex-1 min-h-screen">
				{/* <NavBar user={data?.user} /> */}
				{children}
			</div>
		</div>
	);
}
