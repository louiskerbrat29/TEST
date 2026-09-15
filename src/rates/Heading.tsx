import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_SANS} from '../theme';

const EXIT_DURATION = 14;

export const Heading: React.FC<{
	children: React.ReactNode;
	delay?: number;
	exitAt?: number;
	fontSize?: number;
	color?: string;
	maxWidth?: number;
}> = ({
	children,
	delay = 0,
	exitAt,
	fontSize = 58,
	color = COLORS.white,
	maxWidth = 880,
}) => {
	const frame = useCurrentFrame();
	const local = frame - delay;

	const inOpacity = interpolate(local, [0, 18], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const inTranslateY = interpolate(local, [0, 18], [36, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const exitLocal = exitAt === undefined ? Infinity : frame - exitAt;
	const outOpacity = interpolate(exitLocal, [0, EXIT_DURATION], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const outTranslateY = interpolate(exitLocal, [0, EXIT_DURATION], [0, -30], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const outScale = interpolate(exitLocal, [0, EXIT_DURATION], [1, 0.92], {
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
				opacity: inOpacity * outOpacity,
				transform: `translateY(${inTranslateY + outTranslateY}px) scale(${outScale})`,
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
	exitAt?: number;
	fontSize?: number;
	color?: string;
	maxWidth?: number;
}> = ({
	children,
	delay = 0,
	exitAt,
	fontSize = 34,
	color = COLORS.white,
	maxWidth = 760,
}) => {
	const frame = useCurrentFrame();
	const local = frame - delay;

	const inOpacity = interpolate(local, [0, 15], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const exitLocal = exitAt === undefined ? Infinity : frame - exitAt;
	const outOpacity = interpolate(exitLocal, [0, EXIT_DURATION], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const outTranslateY = interpolate(exitLocal, [0, EXIT_DURATION], [0, -20], {
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
				opacity: inOpacity * outOpacity,
				transform: `translateY(${outTranslateY}px)`,
			}}
		>
			{children}
		</div>
	);
};
