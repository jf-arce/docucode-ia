"use client";

import { useState } from "react";
import AceEditor from "react-ace";
import { Button } from "@/components/ui/button";
import { Sparkles, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-golang";

import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-solarized_dark";
import { Loader } from "./Loader";

interface CodeEditorProps {
	code: string;
	setCode: (code: string) => void;
	language: string;
	setLanguage: (language: string) => void;
	onGenerate: () => void;
	isGenerating: boolean;
}

export function CodeEditor({
	code,
	setCode,
	language,
	setLanguage,
	onGenerate,
	isGenerating,
}: CodeEditorProps) {
	const [height] = useState("100%");

	const handleChange = (value: string) => {
		setCode(value);
	};

	const [theme, setTheme] = useState("dracula");

	return (
		<div className="flex flex-col border-r border-border h-full">
			<div className="min-h-[65px] flex flex-wrap gap-4 justify-between border-b border-border bg-card px-4 py-3">
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" className="gap-2 bg-transparent">
						<Upload className="h-3.5 w-3.5" />
						Upload
					</Button>
					<Button onClick={onGenerate} disabled={isGenerating} size="sm" className="px-2.5">
						<>
							{isGenerating ? <Loader size={16} stroke={2} /> : <Sparkles className="h-4 w-4" />}
							Document
						</>
					</Button>
				</div>

				<div className="flex items-center gap-3">
					<Select value={language} onValueChange={setLanguage}>
						<SelectTrigger className="h-8 text-xs">
							<SelectValue placeholder="Language" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="javascript">JavaScript</SelectItem>
							<SelectItem value="typescript">TypeScript</SelectItem>
							<SelectItem value="python">Python</SelectItem>
							<SelectItem value="java">Java</SelectItem>
							<SelectItem value="c_cpp">C / C++</SelectItem>
							<SelectItem value="csharp">C#</SelectItem>
							<SelectItem value="golang">Go</SelectItem>
						</SelectContent>
					</Select>
					<Select value={theme} onValueChange={setTheme}>
						<SelectTrigger className="h-8 text-xs">Theme</SelectTrigger>
						<SelectContent>
							<SelectItem value="twilight">Twilight</SelectItem>
							<SelectItem value="github">Github</SelectItem>
							<SelectItem value="dracula">Dracula</SelectItem>
							<SelectItem value="solarized_dark">Solarized Dark</SelectItem>
							<SelectItem value="monokai">Monokai</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="flex-1 overflow-hidden">
				<AceEditor
					mode={language}
					theme={theme}
					name="code-editor"
					value={code}
					onChange={handleChange}
					width="100%"
					enableMobileMenu
					height={height}
					fontSize={14}
					showPrintMargin={false}
					showGutter={true}
					highlightActiveLine={true}
					setOptions={{
						useWorker: false,
						tabSize: 2,
						wrap: true,
					}}
					style={{
						backgroundColor: "var(--background)",
						color: "var(--foreground)",
					}}
				/>
			</div>
		</div>
	);
}
