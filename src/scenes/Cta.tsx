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

export const Cta: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const logoScale = spring({
		fps,
		frame: frame - 30,
		config: {damping: 200},
	});

	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				padding: '0 80px',
			}}
		>
			<div
				style={{
					color: COLORS.white,
					fontFamily: FONT_FAMILY,
					fontSize: 46,
					fontWeight: 700,
					textAlign: 'center',
					opacity: titleOpacity,
					marginBottom: 50,
				}}
			>
				Vendez votre maison avec le Cabinet Kerjean
			</div>
			<Img
				src={staticFile('logo.jpg')}
				style={{
					width: 320,
					transform: `scale(${logoScale})`,
					borderRadius: 10,
				}}
			/>
		</AbsoluteFill>
	);
};
