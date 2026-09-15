import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

const EXIT_DURATION = 14;

export const Card: React.FC<{
	children: React.ReactNode;
	delay?: number;
	exitAt?: number;
	width?: number;
}> = ({children, delay = 0, exitAt, width = 900}) => {
	const frame = useCurrentFrame();
	const local = frame - delay;

	const inOpacity = interpolate(local, [0, 15], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const inTranslateY = interpolate(local, [0, 15], [30, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const exitLocal = exitAt === undefined ? Infinity : frame - exitAt;
	const outOpacity = interpolate(exitLocal, [0, EXIT_DURATION], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const outScale = interpolate(exitLocal, [0, EXIT_DURATION], [1, 0.94], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				width,
				background: COLORS.white,
				borderRadius: 28,
				padding: '44px 48px',
				boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
				opacity: inOpacity * outOpacity,
				transform: `translateY(${inTranslateY}px) scale(${outScale})`,
			}}
		>
			{children}
		</div>
	);
};
