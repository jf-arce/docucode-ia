import { createClient } from "@/utils/supabase/client";

export const getUserRepositories = async () => {
	const supabase = createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) return [];

	const providerToken = session.provider_token;

	const { data: user } = await supabase
		.from("user_profiles")
		.select("github_token")
		.eq("user_id", session.user.id)
		.single();

	let tokenToUse = user?.github_token;

	if (providerToken && providerToken !== user?.github_token) {
		// actualizar si hay uno nuevo
		await supabase
			.from("user_profiles")
			.update({ github_token: providerToken })
			.eq("user_id", session.user.id);

		tokenToUse = providerToken;
	}

	if (!tokenToUse) return [];

	const res = await fetch("https://api.github.com/user/repos?type=owner", {
		headers: { Authorization: `Bearer ${tokenToUse}` },
	});

	return res.ok ? res.json() : [];
};
