import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

export const Card: React.FC<{
	children: React.ReactNode;
	delay?: number;
	width?: number;
}> = ({children, delay = 0, width = 900}) => {
	const frame = useCurrentFrame();
	const local = frame - delay;

	const opacity = interpolate(local, [0, 15], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const translateY = interpolate(local, [0, 15], [30, 0], {
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
				opacity,
				transform: `translateY(${translateY}px)`,
			}}
		>
			{children}
		</div>
	);
};
