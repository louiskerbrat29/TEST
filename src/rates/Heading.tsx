import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_SANS} from '../theme';

export const Heading: React.FC<{
	children: React.ReactNode;
	delay?: number;
	fontSize?: number;
	color?: string;
	maxWidth?: number;
}> = ({children, delay = 0, fontSize = 58, color = COLORS.white, maxWidth = 880}) => {
	const frame = useCurrentFrame();
	const local = frame - delay;

	const opacity = interpolate(local, [0, 18], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const translateY = interpolate(local, [0, 18], [36, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				fontFamily: FONT_SANS,
				fontWeight: 900,
				fontSize,
				color,
				lineHeight: 1.15,
				textAlign: 'center',
				maxWidth,
				opacity,
				transform: `translateY(${translateY}px)`,
				textWrap: 'balance' as never,
			}}
		>
			{children}
		</div>
	);
};

export const Subheading: React.FC<{
	children: React.ReactNode;
	delay?: number;
	fontSize?: number;
	color?: string;
	maxWidth?: number;
}> = ({children, delay = 0, fontSize = 34, color = COLORS.white, maxWidth = 760}) => {
	const frame = useCurrentFrame();
	const local = frame - delay;

	const opacity = interpolate(local, [0, 15], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				fontFamily: FONT_SANS,
				fontWeight: 700,
				fontSize,
				color,
				lineHeight: 1.3,
				textAlign: 'center',
				maxWidth,
				opacity,
			}}
		>
			{children}
		</div>
	);
};
