"use client";

import { motion, Variants } from "framer-motion";
import { Terminal } from "lucide-react";
import { Loader2 } from "./Loader";
import { GithubRepositoryDoc } from "@/types/github-repository-docs";

export const RepoDocLoader = ({
	githubRepositoryDoc,
}: {
	githubRepositoryDoc: GithubRepositoryDoc;
}) => {
	const { repo_name } = githubRepositoryDoc;
	// Variantes generales
	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.2 },
		},
	};

	const fadeUpVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		show: {
			opacity: 1,
			y: 0,
			transition: { type: "spring", stiffness: 50, damping: 10 },
		},
	};

	// Variantes para el efecto "Escribiendo"
	const typingContainerVariants: Variants = {
		hidden: { opacity: 1 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.08 },
		},
	};

	const typingLineVariants: Variants = {
		hidden: { scaleX: 0, opacity: 0 },
		show: {
			scaleX: 1,
			opacity: 1,
			transition: {
				duration: 1.2,
				ease: "easeInOut",
			},
		},
	};

	// Animación de los orbes de fondo (Optimizada para GPU)
	const blobVariants: Variants = {
		animate1: {
			x: [0, 80, -40, 0],
			y: [0, -50, 30, 0],
			scale: [1, 1.1, 0.9, 1],
			transition: { duration: 15, repeat: Infinity, ease: "linear" },
		},
		animate2: {
			x: [0, -60, 50, 0],
			y: [0, 60, -40, 0],
			scale: [1, 1.2, 1, 1],
			transition: { duration: 18, repeat: Infinity, ease: "linear", delay: 2 },
		},
	};

	return (
		<div className="flex flex-col items-center lg:justify-center w-full min-h-screen p-4 md:p-10 overflow-hidden">
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="show"
				className="w-full max-w-7xl space-y-8 relative z-10"
			>
				{/* 1. Badge de Estado */}
				<motion.div variants={fadeUpVariants} className="flex flex-col items-center gap-4 mb-8">
					<div className="relative flex items-center gap-2 px-5 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary overflow-hidden">
						{/* Shimmer optimizado usando X translate */}
						<motion.div
							className="absolute inset-0 bg-linear-to-r from-transparent via-primary/10 to-transparent"
							initial={{ x: "-100%" }}
							animate={{ x: "100%" }}
							transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
						/>

						<Loader2 size={20} />
						<span className="text-sm font-medium tracking-wide relative z-10">
							Analizando estructura & Generando docs...
						</span>
					</div>

					{/* Barra de progreso */}
					<div className="h-1.5 w-64 bg-muted/50 rounded-full overflow-hidden relative transform-gpu">
						<motion.div
							className="absolute top-0 bottom-0 left-0 bg-linear-to-r from-primary/80 to-primary origin-left"
							initial={{ scaleX: 0 }}
							animate={{ scaleX: 1 }}
							transition={{
								duration: 4,
								ease: "easeInOut",
								repeat: Infinity,
							}}
							style={{ width: "100%" }}
						/>
					</div>
				</motion.div>

				{/* 2. Card Principal (Flotando suavemente) */}
				<motion.div
					variants={fadeUpVariants}
					className="relative w-full bg-card border border-border/50 rounded-xl shadow-xl shadow-black/5 overflow-hidden transform-gpu"
				>
					{/* --- NUEVO FONDO FLUIDO OPTIMIZADO --- */}
					<div className="absolute inset-0 overflow-hidden pointer-events-none">
						{/* Orbe Primario - OPTIMIZADO: will-change-transform y transform-gpu */}
						<motion.div
							variants={blobVariants}
							animate="animate1"
							className="absolute -top-1/2 -left-1/2 w-[80%] h-[80%] rounded-full bg-primary/20 blur-[100px] mix-blend-soft-light dark:mix-blend-overlay will-change-transform transform-gpu"
						/>
						{/* Orbe Secundario - OPTIMIZADO */}
						<motion.div
							variants={blobVariants}
							animate="animate2"
							className="absolute -bottom-1/2 -right-1/2 w-[80%] h-[80%] rounded-full bg-purple-500/20 blur-[100px] mix-blend-soft-light dark:mix-blend-overlay will-change-transform transform-gpu"
						/>
					</div>

					{/* Cabecera */}
					<div className="border-b border-border/50 p-4 bg-muted/40 flex items-center gap-3 relative z-10">
						<div className="flex gap-2 opacity-80">
							<div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
							<div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
							<div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
						</div>
						<div className="ml-4 flex items-center gap-2 px-3 py-1 rounded bg-background/40 border border-border/30">
							<motion.div
								className="w-2 h-2 bg-primary rounded-full"
								animate={{ opacity: [0.4, 1, 0.4] }}
								transition={{ duration: 2, repeat: Infinity }}
							/>
							<div className="h-2 w-24 bg-muted-foreground/20 rounded-full" />
						</div>
					</div>

					{/* Contenido del Skeleton */}
					<div className="p-8 md:p-10 space-y-8 relative z-10">
						{/* Título */}
						<motion.div
							className="space-y-4"
							variants={typingContainerVariants}
							initial="hidden"
							animate="show"
						>
							<motion.div
								variants={typingLineVariants}
								style={{ width: "65%" }}
								className="h-10 bg-linear-to-r from-muted to-muted/50 rounded-lg origin-left relative overflow-hidden"
							>
								<motion.div
									className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent"
									initial={{ x: "-100%" }}
									animate={{ x: "100%" }}
									transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
								/>
							</motion.div>
							<motion.div
								variants={typingLineVariants}
								style={{ width: "40%" }}
								className="h-4 bg-muted/60 rounded-md origin-left relative overflow-hidden"
							>
								<motion.div
									className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent"
									initial={{ x: "-100%" }}
									animate={{ x: "100%" }}
									transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
								/>
							</motion.div>
						</motion.div>

						<div className="border-t border-border/40" />

						<div className="grid grid-cols-1 md:grid-cols-5 gap-8">
							{/* Texto */}
							<motion.div
								className="md:col-span-3 space-y-4"
								variants={typingContainerVariants}
								initial="hidden"
								animate="show"
							>
								{[95, 88, 92, 75, 80, 50, 90, 65].map((width, i) => (
									<motion.div
										key={i}
										variants={typingLineVariants}
										style={{ width: `${width}%` }}
										className="h-3 bg-muted/40 rounded origin-left relative overflow-hidden"
									>
										<motion.div
											className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent"
											initial={{ x: "-100%" }}
											animate={{ x: "100%" }}
											transition={{
												duration: 2.5,
												repeat: Infinity,
												ease: "linear",
												delay: i * 0.2,
											}}
										/>
									</motion.div>
								))}
							</motion.div>

							{/* Código */}
							<motion.div className="md:col-span-2" variants={fadeUpVariants}>
								<div className="rounded-xl border border-border/50 bg-[#0a0a0a] shadow-lg overflow-hidden relative transform-gpu">
									<div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
										<div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
											<Terminal size={12} />
											<span>{repo_name}</span>
										</div>
									</div>

									<div className="p-5 space-y-3 font-mono text-xs relative z-10">
										<motion.div
											variants={typingContainerVariants}
											initial="hidden"
											animate="show"
											className="space-y-3"
										>
											{/* Líneas de código */}
											<div className="flex gap-3">
												<span className="text-zinc-700 select-none">1</span>
												<motion.div
													variants={typingLineVariants}
													style={{ width: "30%" }}
													className="h-2.5 bg-indigo-500/40 rounded origin-left"
												/>
											</div>
											<div className="flex gap-3">
												<span className="text-zinc-700 select-none">2</span>
												<motion.div
													variants={typingLineVariants}
													style={{ width: "60%" }}
													className="h-2.5 bg-blue-500/40 rounded origin-left"
												/>
											</div>
											<div className="flex gap-3">
												<span className="text-zinc-700 select-none">3</span>
												<motion.div
													variants={typingLineVariants}
													style={{ width: "45%" }}
													className="h-2.5 bg-teal-500/40 rounded origin-left"
												/>
											</div>
											<div className="flex gap-3">
												<span className="text-zinc-700 select-none">4</span>
												<div className="flex items-center gap-1 w-full">
													<motion.div
														variants={typingLineVariants}
														style={{ width: "20%" }}
														className="h-2.5 bg-zinc-700 rounded origin-left"
													/>
													{/* Cursor */}
													<motion.div
														className="w-1.5 h-3 bg-primary"
														animate={{ opacity: [1, 0, 1] }}
														transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
													/>
												</div>
											</div>
										</motion.div>
									</div>

									{/* Shimmer del código OPTIMIZADO */}
									<motion.div
										className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent pointer-events-none"
										initial={{ x: "-100%" }}
										animate={{ x: "100%" }}
										transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
									/>
								</div>
							</motion.div>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
};
