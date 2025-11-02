"use client";

import { useEffect, useState, useRef } from "react";
import AceEditor from "react-ace";
import { Button } from "@/components/ui/button";
import { Sparkles, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loader } from "./Loader";
import { toast } from "sonner";

import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-swift";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/mode-lua";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-toml";
import "ace-builds/src-noconflict/mode-dockerfile";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-tsx";
import "ace-builds/src-noconflict/mode-jsx";

import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-monokai";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/theme-clouds";
import "ace-builds/src-noconflict/theme-solarized_light";

import { useTheme } from "next-themes";

interface CodeEditorProps {
	code: string;
	setCode: (code: string) => void;
	onGenerate: () => void;
	isGenerating: boolean;
}

const DEFAULT_THEME = "one_dark";
const DEFAULT_LANGUAGE = "typescript";

export function CodeEditor({ code, setCode, onGenerate, isGenerating }: CodeEditorProps) {
	const [height] = useState("100%");
	const currentTheme = useTheme();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [codeEditorTheme, setCodeEditorTheme] = useState(() => {
		return localStorage.getItem("editor-theme") || DEFAULT_THEME;
	});
	const [language, setLanguage] = useState(() => {
		return localStorage.getItem("editor-language") || DEFAULT_LANGUAGE;
	});

	useEffect(() => {
		localStorage.setItem("editor-language", language);
	}, [language]);

	useEffect(() => {
		localStorage.setItem("editor-theme", codeEditorTheme);
	}, [codeEditorTheme]);

	const handleChange = (value: string) => {
		setCode(value);
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const detectLanguageFromExtension = (filename: string): string => {
		const extension = filename.split(".").pop()?.toLowerCase();
		const languageMap: { [key: string]: string } = {
			ts: "typescript",
			tsx: "tsx",
			js: "javascript",
			jsx: "jsx",
			py: "python",
			java: "java",
			cpp: "c_cpp",
			c: "c_cpp",
			cs: "csharp",
			go: "golang",
			rs: "rust",
			php: "php",
			rb: "ruby",
			swift: "swift",
			kt: "kotlin",
			lua: "lua",
			sql: "sql",
			sh: "sh",
			bash: "sh",
			yml: "yaml",
			yaml: "yaml",
			json: "json",
			xml: "xml",
			toml: "toml",
			md: "markdown",
			html: "html",
			css: "css",
		};
		return languageMap[extension || ""] || DEFAULT_LANGUAGE;
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Verificar tamaño del archivo (máximo 1MB)
		if (file.size > 1024 * 1024) {
			toast.error("File too large", {
				description: "Please upload a file smaller than 1MB.",
				duration: 3000,
			});
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target?.result as string;
			setCode(content);

			// Detectar y establecer el lenguaje automáticamente
			const detectedLanguage = detectLanguageFromExtension(file.name);
			setLanguage(detectedLanguage);

			toast.success("File uploaded successfully", {
				description: `${file.name} loaded into editor.`,
				duration: 3000,
			});
		};

		reader.onerror = () => {
			toast.error("Upload failed", {
				description: "There was an error reading the file.",
				duration: 3000,
			});
		};

		reader.readAsText(file);

		// Limpiar el input para permitir subir el mismo archivo nuevamente
		event.target.value = "";
	};

	return (
		<div className="flex flex-col border-r border-border h-full">
			<input
				ref={fileInputRef}
				type="file"
				accept=".ts,.tsx,.js,.jsx,.py,.java,.cpp,.c,.cs,.go,.rs,.php,.rb,.swift,.kt,.lua,.sql,.sh,.yml,.yaml,.json,.xml,.toml,.md,.html,.css"
				onChange={handleFileUpload}
				style={{ display: "none" }}
			/>
			<div className="min-h-[65px] flex flex-wrap gap-4 justify-between border-b border-border bg-card px-4 py-3">
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="gap-2 bg-transparent"
						onClick={handleUploadClick}
						disabled={isGenerating}
					>
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
						<SelectContent align="start">
							<SelectItem value="typescript">TypeScript</SelectItem>
							<SelectItem value="tsx">TSX</SelectItem>
							<SelectItem value="javascript">JavaScript</SelectItem>
							<SelectItem value="jsx">JSX</SelectItem>
							<SelectItem value="python">Python</SelectItem>
							<SelectItem value="java">Java</SelectItem>
							<SelectItem value="c_cpp">C / C++</SelectItem>
							<SelectItem value="csharp">C#</SelectItem>
							<SelectItem value="golang">Go</SelectItem>
							<SelectItem value="css">CSS</SelectItem>
							<SelectItem value="html">HTML</SelectItem>
							<SelectItem value="rust">Rust</SelectItem>
							<SelectItem value="php">PHP</SelectItem>
							<SelectItem value="ruby">Ruby</SelectItem>
							<SelectItem value="swift">Swift</SelectItem>
							<SelectItem value="kotlin">Kotlin</SelectItem>
							<SelectItem value="lua">Lua</SelectItem>
							<SelectItem value="sql">SQL</SelectItem>
							<SelectItem value="sh">Shell</SelectItem>
							<SelectItem value="yaml">YAML</SelectItem>
							<SelectItem value="json">JSON</SelectItem>
							<SelectItem value="xml">XML</SelectItem>
							<SelectItem value="toml">TOML</SelectItem>
							<SelectItem value="dockerfile">Dockerfile</SelectItem>
							<SelectItem value="markdown">Markdown</SelectItem>
						</SelectContent>
					</Select>

					<Select value={codeEditorTheme} onValueChange={setCodeEditorTheme}>
						<SelectTrigger className="h-8 text-xs">Theme</SelectTrigger>
						<SelectContent align="start">
							{currentTheme.theme === "dark" ? (
								<>
									<SelectItem value="one_dark">One Dark</SelectItem>
									<SelectItem value="dracula">Dracula</SelectItem>
									<SelectItem value="twilight">Twilight</SelectItem>
									<SelectItem value="monokai">Monokai</SelectItem>
								</>
							) : (
								<>
									<SelectItem value="github">Github</SelectItem>
									<SelectItem value="chrome">Chrome</SelectItem>
									<SelectItem value="clouds">Clouds</SelectItem>
									<SelectItem value="solarized_light">Solarized Light</SelectItem>
								</>
							)}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="flex-1 overflow-hidden custom-ace-editor">
				<AceEditor
					mode={language}
					theme={codeEditorTheme}
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
