import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../theme';

export const SceneTitle: React.FC<{children: React.ReactNode}> = ({
	children,
}) => {
	const frame = useCurrentFrame();

	const opacity = interpolate(frame, [0, 15], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const translateY = interpolate(frame, [0, 15], [20, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				color: COLORS.white,
				fontFamily: FONT_FAMILY,
				fontSize: 52,
				fontWeight: 700,
				opacity,
				transform: `translateY(${translateY}px)`,
				marginBottom: 48,
				textAlign: 'center',
			}}
		>
			{children}
		</div>
	);
};
