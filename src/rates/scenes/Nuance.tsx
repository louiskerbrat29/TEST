import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Heading, Subheading} from '../Heading';
import {COLORS} from '../../theme';

const TOTAL = 130;

export const Nuance: React.FC = () => {
	const frame = useCurrentFrame();
	const exitOpacity = interpolate(frame, [TOTAL - 16, TOTAL], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const exitScale = interpolate(frame, [TOTAL - 16, TOTAL], [1, 0.94], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				padding: '0 80px',
				opacity: exitOpacity,
				transform: `scale(${exitScale})`,
			}}
		>
			<div style={{fontSize: 56}}>🔍</div>
			<div style={{height: 28}} />
			<Subheading delay={6} fontSize={32} maxWidth={780} color={COLORS.white}>
				Bien sûr, les taux ne sont pas le seul facteur.
			</Subheading>
			<div style={{height: 26}} />
			<Heading delay={34} fontSize={40} maxWidth={840}>
				Mais pour comprendre l'évolution des prix immobiliers, regardez
				toujours la capacité d'emprunt des acheteurs.
			</Heading>
		</AbsoluteFill>
	);
};
