"use client";

import { LineSpinner } from "ldrs/react";
import "ldrs/react/LineSpinner.css";
import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";

interface LoaderProps {
	size?: number;
	stroke?: number;
	speed?: number;
}

export const Loader = ({ size = 18, stroke = 2.5, speed = 1 }: LoaderProps) => {
	return <LineSpinner size={size} stroke={stroke} speed={speed} color="currentColor" />;
};

export const Loader2 = ({ size = 60, speed = 1.5 }: LoaderProps) => {
	return <Grid size={size} speed={speed} color="currentColor" />;
};
