"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { RepoDocLoader } from "@/components/RepoDocLoader";
import { GithubRepositoryDoc } from "@/types/github-repository-docs";
import { useRouter } from "next/navigation";

interface RepoDocStatusCheckerProps {
	initialDoc: GithubRepositoryDoc;
}

const POLLING_INTERVAL_MS = 5000;

export function RepoDocStatusChecker({ initialDoc }: RepoDocStatusCheckerProps) {
	const [repoDoc, setRepoDoc] = useState(initialDoc);
	const [isPolling, setIsPolling] = useState(true);
	const supabase = createClient();
	const router = useRouter();

	useEffect(() => {
		const checkStatus = async () => {
			const { data, error } = await supabase
				.from("github_repository_docs")
				.select("is_generated, documentation")
				.eq("id", repoDoc.id)
				.single();

			if (error) {
				console.error("Error fetching status:", error);
				setIsPolling(false);
				return;
			}

			if (data?.is_generated) {
				setRepoDoc((prevDoc) => ({
					...prevDoc,
					is_generated: true,
					documentation: data.documentation,
				}));
				setIsPolling(false);

				router.refresh();
			}
		};

		if (isPolling) {
			const intervalId = setInterval(checkStatus, POLLING_INTERVAL_MS);

			return () => clearInterval(intervalId);
		}
	}, [isPolling, repoDoc.id, supabase, router]);

	return <RepoDocLoader githubRepositoryDoc={repoDoc} />;
}
