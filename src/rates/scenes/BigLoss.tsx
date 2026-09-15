import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CountUp} from '../CountUp';
import {COLORS, FONT_SANS} from '../../theme';
import {Subheading} from '../Heading';
import {formatEuro} from '../format';

const TOTAL = 100;

export const BigLoss: React.FC = () => {
	const frame = useCurrentFrame();
	const exitOpacity = interpolate(frame, [TOTAL - 16, TOTAL], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const exitScale = interpolate(frame, [TOTAL - 16, TOTAL], [1, 0.9], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				padding: '0 60px',
				opacity: exitOpacity,
				transform: `scale(${exitScale})`,
			}}
		>
			<div style={{fontSize: 64}}>📉</div>
			<div style={{height: 10}} />
			<div
				style={{
					fontFamily: FONT_SANS,
					fontWeight: 800,
					fontSize: 34,
					color: COLORS.white,
				}}
			>
				C'est plus de
			</div>
			<CountUp
				to={50000}
				delay={8}
				duration={32}
				format={(n) => formatEuro(n)}
				style={{
					fontFamily: FONT_SANS,
					fontWeight: 900,
					fontSize: 108,
					color: COLORS.white,
					lineHeight: 1,
					margin: '10px 0',
					textShadow: '0 8px 30px rgba(0,0,0,0.25)',
				}}
			/>
			<Subheading delay={22} fontSize={34} maxWidth={760}>
				de pouvoir d'achat immobilier perdu !
			</Subheading>
		</AbsoluteFill>
	);
};
