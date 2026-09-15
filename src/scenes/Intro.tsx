import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {COLORS, FONT_FAMILY} from '../theme';

export const Intro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const logoScale = spring({
		fps,
		frame,
		config: {damping: 200},
	});

	const taglineOpacity = interpolate(frame, [45, 65], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
			}}
		>
			<Img
				src={staticFile('logo.jpg')}
				style={{
					width: 520,
					transform: `scale(${logoScale})`,
					borderRadius: 12,
				}}
			/>
			<div
				style={{
					color: COLORS.white,
					fontFamily: FONT_FAMILY,
					fontSize: 32,
					fontWeight: 600,
					marginTop: 40,
					opacity: taglineOpacity,
					textAlign: 'center',
					padding: '0 60px',
				}}
			>
				Votre partenaire immobilier dans le Finistère Nord
			</div>
		</AbsoluteFill>
	);
};
