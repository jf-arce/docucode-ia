"use client";

import { CodeEditor } from "@/components/CodeEditor";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DocumentationPanel } from "@/components/DocumentationPanel";
import Split from "react-split";
import { useIsMobile } from "@/hooks/use-mobile";

export default function WorkspacePage() {
	const [code, setCode] = useState<string>("");
	const [documentation, setDocumentation] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const isMobile = useIsMobile();

	useEffect(() => {}, [isMobile]);

	const handleGenerate = async () => {
		if (!code.trim()) {
			toast.error("Please enter some code to document", {
				description: "The code editor is empty.",
				duration: 3000,
			});
			return;
		}

		setIsGenerating(true);

		// [ ... Simulación del código de documentación ... ]
		// ...

		// Simulación de la llamada a la API
		setTimeout(() => {
			const generatedDocs = `# Code Documentation ...`;

			setDocumentation(generatedDocs);
			setIsGenerating(false);

			toast.success("Documentation generated successfully", {
				duration: 3000,
			});
		}, 2000);
	};

	return (
		<div className="flex h-full flex-col">
			{/* <div className="flex flex-col sm:flex-row flex-1 overflow-hidden"> */}
			<Split
				className="split w-full h-full flex flex-col"
				sizes={[50, 50]}
				direction={isMobile ? "vertical" : "horizontal"}
				expandToMin={!isMobile}
				minSize={100}
				gutterSize={8}
			>
				<div className="h-full">
					<CodeEditor
						code={code}
						setCode={setCode}
						onGenerate={handleGenerate}
						isGenerating={isGenerating}
					/>
				</div>
				<div className="h-full">
					<DocumentationPanel
						documentation={documentation}
						setDocumentation={setDocumentation}
						isGenerating={isGenerating}
					/>
				</div>
			</Split>
			{/* </div> */}
		</div>
	);
}
