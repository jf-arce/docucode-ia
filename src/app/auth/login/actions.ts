"use server";

import { createClient } from "@/utils/supabase/server";

interface PreviousState {
	error: string | null;
	success: boolean;
}

export async function login(_previousState: PreviousState | null, formData: FormData) {
	const supabase = await createClient();

	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		return { error: error.message, success: false };
	}

	return { error: null, success: true };
}

export async function signup(_previousState: PreviousState | null, formData: FormData) {
	const supabase = await createClient();

	const name = formData.get("name") as string;
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	const validation = signupValidation(name, email, password);

	if (!validation.success) {
		return { error: validation.error, success: false };
	}

	const data = {
		email: email,
		password: password,
		options: {
			data: {
				name: name,
				display_name: name,
			},
		},
	};

	const { error } = await supabase.auth.signUp(data);

	if (error) {
		return { error: error.message, success: false };
	}

	return { error: null, success: true };
}

const signupValidation = (name: string, email: string, password: string): PreviousState => {
	let error = null;
	let success = true;

	if (!name || !email || !password) {
		error = "All fields are required.";
		success = false;
	}

	if (name.length < 3) {
		error = "The name is too short.";
		success = false;
	}

	if (name.length > 50) {
		error = "The name is too long.";
		success = false;
	}

	if (password.length < 8) {
		error = "The password must be at least 8 characters long.";
		success = false;
	}

	if (!password.match(/[0-9]/)) {
		error = "The password must contain at least one number.";
		success = false;
	}

	return { error, success };
};
