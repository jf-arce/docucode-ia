"use client";

import { AlertCircle } from "lucide-react";

export default function Error() {
	return (
		<div className="p-4 flex flex-col gap-4 sm:flex-row sm:gap-0 justify-center items-center h-full ">
			<AlertCircle className="mr-2" />
			An unexpected error occurred. Please try again later.
		</div>
	);
}
