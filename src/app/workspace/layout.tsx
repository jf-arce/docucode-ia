import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProjectsSidebar } from "@/components/ProjectsSidebar";
import { NavbarWorkspaceWrapper } from "@/components/NavbarWorkspaceWrapper";
import { getProjectsData } from "@/data/createNewProject.data";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		return redirect("/");
	}

	const userProjectsData = await getProjectsData(data.user.id);

	return (
		<div className="flex">
			<div className="relative">
				<ProjectsSidebar user={data?.user} userProjectsData={userProjectsData} />
			</div>
			<div className="flex-1 min-h-screen">
				<NavbarWorkspaceWrapper user={data?.user} />
				{children}
			</div>
		</div>
	);
}
