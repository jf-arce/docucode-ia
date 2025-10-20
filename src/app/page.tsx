"use client";

import React, { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import { toast } from "sonner";

export default function Home() {
	const [code, setCode] = useState("");
	const [documentation, setDocumentation] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [language, setLanguage] = useState("javascript");

	const handleGenerate = () => {
		if (!code.trim()) {
			toast.error("Please enter some code to document", {
				description: "The code editor is empty.",
				duration: 3000,
			});
			return;
		}

		setIsGenerating(true);
		setTimeout(() => {
			setDocumentation("# Code Documentation ...");
			setIsGenerating(false);
			toast.success("Documentation generated successfully", { duration: 3000 });
		}, 2000);
	};

	return (
		<div className="flex flex-1 overflow-hidden">
			<CodeEditor
				code={code}
				setCode={setCode}
				language={language}
				setLanguage={setLanguage}
				onGenerate={handleGenerate}
				isGenerating={isGenerating}
			/>
			<DocumentationPanel
				documentation={documentation}
				setDocumentation={setDocumentation}
				isGenerating={isGenerating}
			/>
		</div>
	);
}
