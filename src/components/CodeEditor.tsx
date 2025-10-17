"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Upload } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

import { EditorView, basicSetup } from "codemirror";
import { EditorState, StateEffect } from "@codemirror/state";
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";

interface CodeEditorProps {
	code: string;
	setCode: (code: string) => void;
	language: string;
	setLanguage: (language: string) => void;
	onGenerate: () => void;
	isGenerating: boolean;
}

// Función para obtener la extensión del lenguaje
const getLanguageExtension = (lang: string) => {
	switch (lang) {
		case "javascript":
			return javascript();
		case "typescript":
			return javascript({ typescript: true });
		case "python":
			return python();
		case "java":
			return java();
		case "csharp":
		case "go":
			return cpp();
		default:
			return javascript();
	}
};

export function CodeEditor({
	code,
	setCode,
	language,
	setLanguage,
	onGenerate,
	isGenerating,
}: CodeEditorProps) {
	const editorRef = useRef<HTMLDivElement>(null);
	const viewRef = useRef<EditorView | null>(null);

	useEffect(() => {
		if (!editorRef.current) return;

		// ⚙️ Configuración común de extensiones
		const buildExtensions = () => [
			basicSetup,
			getLanguageExtension(language),
			oneDark,
			syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
			EditorView.updateListener.of((update) => {
				if (update.docChanged) {
					setCode(update.state.doc.toString());
				}
			}),
			EditorView.theme({
				"&": {
					height: "100%",
					backgroundColor: "transparent",
				},
				".cm-content": {
					fontFamily: "monospace",
					fontSize: "14px",
					color: "hsl(var(--foreground))",
				},
				".cm-gutters": {
					backgroundColor: "transparent",
					borderRight: "1px solid hsl(var(--border))",
				},
			}),
		];

		// Si ya existe un editor → reconfiguramos
		if (viewRef.current) {
			viewRef.current.dispatch({
				effects: StateEffect.reconfigure.of(buildExtensions()),
			});
			return;
		}

		// Si no existe → lo creamos
		const state = EditorState.create({
			doc: code,
			extensions: buildExtensions(),
		});

		viewRef.current = new EditorView({
			state,
			parent: editorRef.current,
		});

		return () => {
			viewRef.current?.destroy();
			viewRef.current = null;
		};
	}, [language, setCode]);

	// 🔄 Sincronizar código externo → editor
	useEffect(() => {
		if (viewRef.current && code !== viewRef.current.state.doc.toString()) {
			const transaction = viewRef.current.state.update({
				changes: { from: 0, to: viewRef.current.state.doc.length, insert: code },
			});
			viewRef.current.dispatch(transaction);
		}
	}, [code]);

	return (
		<div className="flex w-1/2 flex-col border-r border-border">
			{/* Encabezado */}
			<div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
				<div className="flex items-center gap-3">
					<h2 className="font-mono text-sm font-medium text-foreground">Code Editor</h2>
					<Select value={language} onValueChange={setLanguage}>
						<SelectTrigger className="h-8 w-[140px] text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="javascript">JavaScript</SelectItem>
							<SelectItem value="typescript">TypeScript</SelectItem>
							<SelectItem value="python">Python</SelectItem>
							<SelectItem value="java">Java</SelectItem>
							<SelectItem value="csharp">C#</SelectItem>
							<SelectItem value="go">Go</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" className="h-8 gap-2 bg-transparent">
						<Upload className="h-3.5 w-3.5" />
						Upload
					</Button>
					<Button onClick={onGenerate} disabled={isGenerating} size="sm" className="h-8 gap-2">
						{isGenerating ? (
							<>
								<Spinner className="h-3.5 w-3.5" />
								Generating...
							</>
						) : (
							<>
								<Sparkles className="h-3.5 w-3.5" />
								Document
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Área del editor */}
			<div ref={editorRef} className="flex-1 overflow-auto bg-editor-bg" />
		</div>
	);
}
