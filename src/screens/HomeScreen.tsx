"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Code2, Sparkles, FileText, Zap, ArrowRight, Terminal, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const HomeScreen = () => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const codeSnippets = [
		{ lang: "tsx", code: "function DocumentCode() {" },
		{ lang: "py", code: "def analyze_code():" },
		{ lang: "js", code: "const generateDocs = () => {" },
		{ lang: "ts", code: "interface CodeAnalysis {" },
	];

	return (
		<div className="relative min-h-screen overflow-hidden bg-background">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

			<div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
			<div className="absolute right-1/4 top-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

			<div className="relative mx-auto max-w-7xl px-4 py-13 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center text-center">
					<div
						className={`mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm backdrop-blur-sm transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
					>
						<Sparkles className="h-4 w-4 text-primary" />
						<span className="text-muted-foreground">Powered by AI</span>
					</div>

					<h1
						className={`mb-6 max-w-4xl font-geist-mono text-5xl font-bold leading-tight tracking-tight text-foreground transition-all duration-700 delay-100 sm:text-6xl lg:text-7xl ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
					>
						Document Your Code{" "}
						<span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
							Instantly
						</span>
					</h1>

					<p
						className={`mb-10 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground transition-all duration-700 delay-200 sm:text-xl ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
					>
						Transform your codebase into comprehensive documentation with AI. Save hours of manual
						work and keep your docs always up-to-date.
					</p>

					<div
						className={`flex flex-col gap-4 sm:flex-row transition-all duration-700 delay-300 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
					>
						<Button size="lg" className="group gap-2 text-base" asChild>
							<Link href="/workspace">
								<Terminal className="h-5 w-5" />
								Start Documenting
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
							</Link>
						</Button>
						<Button size="lg" variant="outline" className="gap-2 text-base bg-transparent" asChild>
							<Link href="#features">
								<BookOpen className="h-5 w-5" />
								See How It Works
							</Link>
						</Button>
					</div>

					<div
						className={`mt-16 w-full max-w-4xl transition-all duration-700 delay-500 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
					>
						<div className="relative rounded-xl border border-border bg-card/50 p-8 shadow-2xl backdrop-blur-sm">
							<div className="mb-6 flex items-center gap-2">
								<div className="h-3 w-3 rounded-full bg-destructive/80" />
								<div className="h-3 w-3 rounded-full bg-chart-4/80" />
								<div className="h-3 w-3 rounded-full bg-chart-2/80" />
								<span className="ml-4 font-mono text-sm text-muted-foreground">
									code-analyzer.ts
								</span>
							</div>

							<div className="space-y-3 font-mono text-sm">
								{codeSnippets.map((snippet, index) => (
									<div
										key={index}
										className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4"
										style={{
											animationDelay: `${600 + index * 100}ms`,
											animationFillMode: "backwards",
										}}
									>
										<span className="text-muted-foreground">{index + 1}</span>
										<code className="text-foreground">{snippet.code}</code>
										<Sparkles className="ml-auto h-4 w-4 text-primary animate-pulse" />
									</div>
								))}
							</div>

							<div className="mt-6 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
									<Zap className="h-4 w-4 text-primary animate-pulse" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-foreground">AI Analysis Complete</p>
									<p className="text-xs text-muted-foreground">Documentation generated in 2.3s</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div
					id="features"
					className={`mt-32 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 delay-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
				>
					<FeatureCard
						icon={<Code2 className="h-6 w-6" />}
						title="Smart Code Analysis"
						description="AI understands your code structure, patterns, and logic to generate accurate documentation."
					/>
					<FeatureCard
						icon={<FileText className="h-6 w-6" />}
						title="Auto-Generated Docs"
						description="Create comprehensive documentation for functions, classes, and entire projects instantly."
					/>
					<FeatureCard
						icon={<Zap className="h-6 w-6" />}
						title="Lightning Fast"
						description="Process thousands of lines of code in seconds. No more manual documentation work."
					/>
				</div>
			</div>
		</div>
	);
};

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="group relative rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg">
			<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
				{icon}
			</div>
			<h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
			<p className="text-pretty text-sm leading-relaxed text-muted-foreground">{description}</p>
		</div>
	);
}
