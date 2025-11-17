"use client";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center h-full">
			<h1 className="text-2xl font-bold mb-4">404 - Document Not Found</h1>
			<p className="text-md text-muted-foreground">
				The document you are looking for does not exist or has been deleted.
			</p>
		</div>
	);
}
