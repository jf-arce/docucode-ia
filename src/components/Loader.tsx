"use client";

import { LineSpinner } from "ldrs/react";
import "ldrs/react/LineSpinner.css";

interface LoaderProps {
	size?: number;
}

export const Loader = ({ size = 18 }: LoaderProps) => {
	return <LineSpinner size={size} stroke="2.5" speed="1" color="currentColor" />;
};
