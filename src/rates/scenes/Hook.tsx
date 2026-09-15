import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Heading, Subheading} from '../Heading';

const TOTAL = 130;

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const exitOpacity = interpolate(frame, [TOTAL - 18, TOTAL], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const exitScale = interpolate(frame, [TOTAL - 18, TOTAL], [1, 0.94], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				padding: '0 70px',
				opacity: exitOpacity,
				transform: `scale(${exitScale})`,
			}}
		>
			<Heading delay={4} fontSize={62}>
				Pourquoi les prix de l'immobilier ont-ils baissé ces dernières
				années&nbsp;?
			</Heading>
			<div style={{height: 44}} />
			<Subheading delay={32} fontSize={36}>
				👉 Regardez ce qui s'est passé avec les taux de crédit.
			</Subheading>
		</AbsoluteFill>
	);
};
