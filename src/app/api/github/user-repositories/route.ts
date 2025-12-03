import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
	const supabase = await createClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.provider_token) {
		return NextResponse.json({ error: "Unauthorized or missing GitHub token" }, { status: 401 });
	}

	const tokenToUse = session.provider_token;

	const res = await fetch("https://api.github.com/user/repos?type=owner", {
		headers: { Authorization: `Bearer ${tokenToUse}` },
	});

	const repos = res.ok ? await res.json() : [];

	return NextResponse.json(repos);
}
