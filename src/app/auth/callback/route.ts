import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Session } from "@supabase/supabase-js";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	// if "next" is in param, use it as the redirect URL
	let next = searchParams.get("next") ?? "/";
	if (!next.startsWith("/")) {
		// if "next" is not a relative URL, use the default
		next = "/";
	}

	if (code) {
		const supabase = await createClient();

		const { error, data: sessionData } = await supabase.auth.exchangeCodeForSession(code);

		if (!error && sessionData.session) {
			await upsertUserProfile(sessionData.session);
			const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
			const isLocalEnv = process.env.NODE_ENV === "development";
			if (isLocalEnv) {
				// we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
				return NextResponse.redirect(`${origin}${next}`);
			} else if (forwardedHost) {
				return NextResponse.redirect(`https://${forwardedHost}${next}`);
			} else {
				return NextResponse.redirect(`${origin}${next}`);
			}
		}
	}

	// return the user to an error page with instructions
	return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

const upsertUserProfile = async (session: Session) => {
	const supabase = await createClient();
	const { user, provider_token: providerToken } = session;

	const { data: existingProfile } = await supabase
		.from("user_profiles")
		.select("user_id, github_token")
		.eq("user_id", user.id)
		.single();

	if (!existingProfile) {
		// Crear perfil si no existía
		await supabase.from("user_profiles").insert({
			user_id: user.id,
			email: user.email,
			github_token: user.app_metadata.provider === "github" ? providerToken : null,
		});
	} else if (
		user.app_metadata.provider === "github" &&
		providerToken &&
		providerToken !== existingProfile.github_token
	) {
		// Actualizar token si se logueo con GitHub y cambió
		await supabase
			.from("user_profiles")
			.update({ github_token: providerToken })
			.eq("user_id", user.id);
	}
};
