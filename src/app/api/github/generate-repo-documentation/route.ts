import { systemPrompt } from "@/utils/generate-document-github/system-prompt";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import pLimit from "p-limit";

const google = createGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

const model = google("gemini-2.5-flash");

interface GitHubTreeItem {
	path: string;
	mode: string;
	type: "blob" | "tree";
	sha: string;
	size?: number;
	url: string;
}

interface GitHubTreeResponse {
	sha: string;
	url: string;
	tree: GitHubTreeItem[];
	truncated: boolean;
}

export async function POST(request: Request) {
	try {
		const { repositoryUrl, branch } = await request.json();

		const { owner, repo, branch: parsedBranch } = parseGitHubUrl(repositoryUrl);
		const branchToUse = branch ?? parsedBranch;

		// 1. Get the file tree
		const treeData = await getRepoTree(owner, repo, branchToUse, process.env.GITHUB_TOKEN);

		if (!treeData.tree) {
			return Response.json({ error: "Could not fetch repository tree" }, { status: 400 });
		}

		// 2. Filter relevant files (code files, README, etc.)
		const filesToProcess = treeData.tree
			.filter((f) => f.type === "blob")
			.filter((f) => isValidExtension(f.path) && !isExcluded(f.path));

		// 3. Fetch file contents (with concurrency limit)
		const limit = pLimit(10);
		const fileContents = await Promise.all(
			filesToProcess.map((file) =>
				limit(async () => {
					try {
						const content = await getRawFile(
							owner,
							repo,
							branchToUse,
							file.path,
							process.env.GITHUB_TOKEN,
						);
						return { path: file.path, content };
					} catch (e) {
						console.error(`Failed to fetch ${file.path}`, e);
						return null;
					}
				}),
			),
		);

		const validFiles = fileContents.filter((f) => f !== null) as {
			path: string;
			content: string;
		}[];

		// 4. Generate Documentation using Gemini
		const { text: documentation } = await generateText({
			model,
			system: systemPrompt,
			prompt: `Here is the codebase content:\n\n${JSON.stringify(validFiles, null, 2)}`,
		});

		return Response.json({ documentation });
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
		throw new Error("Unknown error");
	}
}

// --- Helpers ---

function parseGitHubUrl(url: string) {
	try {
		const u = new URL(url);
		if (u.hostname !== "github.com" && u.hostname !== "www.github.com")
			throw new Error(`invalid host: ${u.hostname}`);
		const parts = u.pathname.replace(/^\/|\/$/g, "").split("/");
		const owner = parts[0];
		const repo = parts[1];
		let branch = "main";
		const treeIndex = parts.indexOf("tree");
		if (treeIndex >= 0 && parts.length > treeIndex + 1) branch = parts[treeIndex + 1];
		if (!owner || !repo) throw new Error("invalid repo url");
		return { owner, repo, branch };
	} catch (e: unknown) {
		if (e instanceof Error) {
			throw new Error(e.message);
		}
		throw new Error("invalid github url");
	}
}

async function getRepoTree(
	owner: string,
	repo: string,
	branch = "main",
	githubToken?: string,
): Promise<GitHubTreeResponse> {
	const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
	const headers: Record<string, string> = { Accept: "application/vnd.github.v3+json" };
	if (githubToken) headers.Authorization = `token ${githubToken}`;
	const res = await fetch(url, { headers });
	if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
	return res.json();
}

async function getRawFile(
	owner: string,
	repo: string,
	branch: string,
	path: string,
	githubToken?: string,
) {
	const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodeURIComponent(path)}`;
	const res = await fetch(rawUrl, {
		headers: githubToken ? { Authorization: `token ${githubToken}` } : {},
	});
	if (!res.ok) throw new Error(`raw fetch failed ${res.status}`);
	return res.text();
}

function isValidExtension(path: string) {
	const ext = path.split(".").pop()?.toLowerCase();
	const valid = [
		"ts",
		"tsx",
		"js",
		"jsx",
		"py",
		"go",
		"java",
		"c",
		"cpp",
		"h",
		"hpp",
		"rs",
		"rb",
		"php",
		"md",
		"json",
		"html",
		"css",
		"sql",
		"prisma",
	];
	return ext && valid.includes(ext);
}

function isExcluded(path: string) {
	const excluded = [
		"node_modules",
		"dist",
		"build",
		".git",
		"package-lock.json",
		"yarn.lock",
		"pnpm-lock.yaml",
		".next",
		".vercel",
		".vscode",
		".idea",
	];
	return excluded.some((e) => path.includes(e));
}
