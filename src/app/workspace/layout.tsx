import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProjectsSidebar } from "@/components/ProjectsSidebar";
import { NavbarWorkspaceWrapper } from "@/components/NavbarWorkspaceWrapper";
import { getProjectsData } from "@/data/project/getProject.data";
import { WorkspaceProvider } from "@/context/WorkspaceContext";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		return redirect("/");
	}

	const userProjectsData = await getProjectsData(data.user.id);

	return (
		<div className="fixed inset-0 flex overflow-hidden bg-background">
			<WorkspaceProvider>
				<div className="relative h-full">
					<ProjectsSidebar user={data?.user} userProjectsData={userProjectsData} />
				</div>
				<div className="flex-1 flex flex-col h-full overflow-hidden">
					<NavbarWorkspaceWrapper user={data?.user} />
					<main className="flex-1 flex flex-col overflow-hidden relative">{children}</main>
				</div>
			</WorkspaceProvider>
		</div>
	);
}
