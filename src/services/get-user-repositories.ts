export const getUserRepositories = async () => {
	const res = await fetch("/api/github/user-repositories", {
		method: "GET",
		cache: "no-store",
	});

	if (!res.ok) {
		if (res.status === 401) {
			throw new Error("Unauthorized");
		}
		throw new Error(`API error: ${res.status}`);
	}

	const repositories = await res.json();

	return repositories;
};
