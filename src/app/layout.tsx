import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
	title: "DocuCode AI",
	description: "Generate comprehensive documentation for your code automatically using AI",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
					<SidebarProvider>
						<div className="flex flex-col flex-1 overflow-hidden">
							<main className="min-h-[calc(100vh-56px)]">{children}</main>
						</div>
					</SidebarProvider>
				</ThemeProvider>
				<Toaster theme="dark" position="bottom-right" richColors />
			</body>
		</html>
	);
}
