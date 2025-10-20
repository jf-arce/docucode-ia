"use client";

import { LineSpinner } from "ldrs/react";
import "ldrs/react/LineSpinner.css";

interface LoaderProps {
	size?: number;
	stroke?: number;
	speed?: number;
}

export const Loader = ({ size = 18, stroke = 2.5, speed = 1 }: LoaderProps) => {
	return <LineSpinner size={size} stroke={stroke} speed={speed} color="currentColor" />;
};
