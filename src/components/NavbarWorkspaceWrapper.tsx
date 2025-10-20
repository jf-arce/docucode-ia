"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { NavBar } from "./NavBar";
import { User } from "@supabase/supabase-js";
import { useEffect } from "react";

export const NavbarWorkspaceWrapper = ({ user }: { user: User }) => {
	const isMobile = useIsMobile();

	useEffect(() => {}, [isMobile]);

	return isMobile ? <NavBar user={user} /> : null;
};
