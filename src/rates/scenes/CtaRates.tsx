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
import {COLORS, FONT_SANS} from '../../theme';
import {Heading} from '../Heading';

export const CtaRates: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const logoScale = spring({
		fps,
		frame: frame - 70,
		config: {damping: 200},
	});

	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				padding: '0 70px',
			}}
		>
			<Heading delay={0} fontSize={46} maxWidth={820}>
				Vous voulez savoir ce qu'il se passe actuellement sur Landerneau
				et ses alentours&nbsp;?
			</Heading>
			<div style={{height: 56}} />
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					transform: `scale(${logoScale})`,
				}}
			>
				<Img
					src={staticFile('logo.jpg')}
					style={{width: 300, borderRadius: 14, boxShadow: '0 20px 50px rgba(0,0,0,0.35)'}}
				/>
			</div>
			<div style={{height: 30}} />
			<div
				style={{
					fontFamily: FONT_SANS,
					fontWeight: 900,
					fontSize: 40,
					color: COLORS.white,
					opacity: interpolate(frame, [95, 115], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
				}}
			>
				👉 Cabinet Kerjean
			</div>
		</AbsoluteFill>
	);
};
