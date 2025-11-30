export const WorkspaceBackground = () => {
	return (
		<div className="min-h-screen w-full absolute -z-50">
			<div
				className="absolute inset-0 z-0"
				style={{
					backgroundImage: `
       radial-gradient(circle at 30% 30%, #222222 0.5px, transparent 1px),
       radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
     `,
					backgroundSize: "10px 10px",
					imageRendering: "pixelated",
				}}
			/>
		</div>
	);
};
