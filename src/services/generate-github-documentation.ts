/**
 * Service to generate documentation for a GitHub repository.
 */
export const generateGitHubRepositoryDocumentation = async (repositoryUrl: string) => {
	const res = await fetch("/api/generate-document/github", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ repositoryUrl }),
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.error || "Failed to generate documentation");
	}

	const data = await res.json();
	return data.documentation;
};
