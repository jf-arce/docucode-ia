"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Upload } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

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
	return (
		<div className="flex w-1/2 flex-col border-r border-border">
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

			<div className="flex-1 overflow-auto bg-editor-bg p-4">
				<textarea
					value={code}
					onChange={(e) => setCode(e.target.value)}
					className="h-full w-full resize-none bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
					placeholder="Paste or write your code here..."
					spellCheck={false}
				/>
			</div>
		</div>
	);
}
