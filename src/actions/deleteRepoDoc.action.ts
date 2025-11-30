"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteRepoDocAction(repoDocId: string) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "Unauthorized" };
	}

	try {
		const { data: deletedRepoDoc, error: repoDocError } = await supabase
			.from("github_repository_docs")
			.delete()
			.eq("id", repoDocId)
			.eq("user_id", user.id)
			.select();

		if (repoDocError) {
			return {
				success: false,
				error: `Failed to delete repository documentation: ${repoDocError.message}`,
			};
		}

		if (!deletedRepoDoc || deletedRepoDoc.length === 0) {
			return {
				success: false,
				error:
					"Unable to delete repository documentation. Please check your permissions or try refreshing the page.",
			};
		}

		revalidatePath("/workspace");

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
