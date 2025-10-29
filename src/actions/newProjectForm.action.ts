"use server";

import { createNewProjectData } from "@/data/project/createNewProject.data";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createNewProjectAction(data: FormData) {
	const supabase = await createClient();
	const name = data.get("name") as string;
	const description = data.get("description") as string;
	const userId = await supabase.auth.getUser().then(({ data }) => data.user?.id as string);

	await createNewProjectData({ name, description, userId });

	revalidatePath("/workspace");
}
