import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { data: userProfile } = await supabase
		.from("user_profiles")
		.select("github_token")
		.eq("user_id", user.id)
		.single();

	const tokenToUse = userProfile?.github_token;

	if (!tokenToUse) {
		return NextResponse.json({ error: "Missing GitHub token" }, { status: 401 });
	}

	const res = await fetch("https://api.github.com/user/repos?type=owner", {
		headers: { Authorization: `Bearer ${tokenToUse}` },
	});

	const repos = res.ok ? await res.json() : [];

	return NextResponse.json(repos);
}
