"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { RepoDocLoader } from "@/components/RepoDocLoader";
import { GithubRepositoryDoc } from "@/types/github-repository-docs";
import { DocumentationPanel } from "@/components/DocumentationPanel";

interface RepoDocStatusCheckerProps {
	initialDoc: GithubRepositoryDoc;
}

const POLLING_INTERVAL_MS = 5000;

export function RepoDocStatusChecker({ initialDoc }: RepoDocStatusCheckerProps) {
	const [repoDoc, setRepoDoc] = useState(initialDoc);
	const [isPolling, setIsPolling] = useState(true);
	const supabase = createClient();

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
			}
		};

		if (isPolling) {
			const intervalId = setInterval(checkStatus, POLLING_INTERVAL_MS);

			return () => clearInterval(intervalId);
		}
	}, [isPolling, repoDoc.id, supabase]);

	if (!repoDoc.is_generated) {
		return <RepoDocLoader githubRepositoryDoc={repoDoc} />;
	}

	return <DocumentationPanel documentation={repoDoc.documentation || ""} isGenerating={false} />;
}
