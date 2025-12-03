/**
 * Service to generate documentation for a GitHub repository.
 */
export const generateGitHubRepositoryDocumentation = async (
	repositoryUrl: string,
	docLanguage: string,
) => {
	const res = await fetch("/api/github/generate-repo-documentation", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ repositoryUrl, docLanguage }),
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.error || "Failed to generate documentation");
	}

	const data = await res.json();
	return data.documentation;
};
