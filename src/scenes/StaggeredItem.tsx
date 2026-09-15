import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY} from '../theme';

export const StaggeredItem: React.FC<{
	delay: number;
	children: React.ReactNode;
	fontSize?: number;
}> = ({delay, children, fontSize = 34}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const localFrame = frame - delay;

	const translateX = spring({
		fps,
		frame: localFrame,
		config: {damping: 200},
		durationInFrames: 20,
	});

	const opacity = interpolate(localFrame, [0, 15], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				opacity,
				transform: `translateX(${(1 - translateX) * -40}px)`,
				marginBottom: 22,
			}}
		>
			<div
				style={{
					width: 14,
					height: 14,
					borderRadius: '50%',
					background: COLORS.red,
					marginRight: 20,
					flexShrink: 0,
				}}
			/>
			<div
				style={{
					color: COLORS.white,
					fontSize,
					fontFamily: FONT_FAMILY,
					fontWeight: 600,
				}}
			>
				{children}
			</div>
		</div>
	);
};
