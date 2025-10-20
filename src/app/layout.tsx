import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/NavBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProjectsSidebar } from "@/components/ProjectsSidebar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
	title: "DocuCode AI",
	description: "Generate comprehensive documentation for your code automatically using AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<SidebarProvider>
					<div className="flex h-screen w-full">
						<ProjectsSidebar />
						<main className="flex-1 flex flex-col overflow-hidden">
							<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
								<NavBar />
								{children}
							</ThemeProvider>
						</main>
					</div>
				</SidebarProvider>
			</body>
		</html>
	);
}

