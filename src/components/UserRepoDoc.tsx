import { GithubRepositoryDoc } from "@/types/github-repository-docs";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { FileTextIcon } from "@/components/Icons";

export const UserRepoDoc = ({ repoDoc }: { repoDoc: GithubRepositoryDoc }) => {
	return (
		<SidebarMenuItem>
			<SidebarMenuButton className="cursor-pointer w-full" asChild>
				<Link href={`/workspace/repo/${repoDoc.id}`}>
					<FileTextIcon />
					<span>{repoDoc.repo_name}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};
