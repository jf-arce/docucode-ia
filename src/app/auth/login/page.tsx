"use client";

import { useActionState, useEffect, useState } from "react";
import { login, signup } from "@/app/auth/login/actions";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface LoginPageProps {
	searchParams: Promise<{ mode: "signup" | undefined }>;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
	const [mode, setMode] = useState<"login" | "signup">();
	const router = useRouter();
	const [loginState, loginFormAction, loginPending] = useActionState(login, null);
	const [signupState, signupFormAction, signupPending] = useActionState(signup, null);

	useEffect(() => {
		const fetchMode = async () => {
			const { mode } = await searchParams;
			if (mode) {
				setMode(mode === "signup" ? "signup" : "login");
			} else {
				setMode("login");
			}
		};

		fetchMode();
	}, [searchParams]);

	return (
		<div className="flex items-center justify-center bg-background px-4 w-full flex-1">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-center text-xl font-bold">
						{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
					</CardTitle>
				</CardHeader>

				<CardContent className="flex flex-col gap-4">
					<form
						className="flex flex-col gap-4"
						action={mode === "login" ? loginFormAction : signupFormAction}
					>
						{mode === "signup" && (
							<div className="flex flex-col gap-3">
								<Label htmlFor="name">Nombre</Label>
								<Input id="name" type="text" name="name" required />
							</div>
						)}

						<div className="flex flex-col gap-3">
							<Label htmlFor="email">Correo electrónico</Label>
							<Input id="email" type="email" name="email" required />
						</div>

						<div className="flex flex-col gap-3">
							<Label htmlFor="password">Contraseña</Label>
							<Input id="password" type="password" name="password" required />
						</div>

						{loginState?.error && <p className="text-red-500 text-sm">{loginState.error}</p>}
						{signupState?.error && <p className="text-red-500 text-sm">{signupState.error}</p>}

						<Button type="submit" className="w-full mt-2">
							{(loginPending || signupPending) && <Loader2 className="w-4 h-4 animate-spin" />}
							{mode === "login" ? "Iniciar sesión" : "Registrarme"}
						</Button>

						<Button
							variant="link"
							type="button"
							className="self-center text-sm"
							onClick={() =>
								router.push(mode === "login" ? "/auth/login?mode=signup" : "/auth/login")
							}
						>
							{mode === "login"
								? "¿No tienes cuenta? Crear una"
								: "¿Ya tienes cuenta? Iniciar sesión"}
						</Button>
					</form>

					<div className="flex items-center gap-2 my-4">
						<Separator className="flex-1" />
						<span className="text-sm text-gray-500">o</span>
						<Separator className="flex-1" />
					</div>

					<GoogleLoginButton />
				</CardContent>
			</Card>
		</div>
	);
}
