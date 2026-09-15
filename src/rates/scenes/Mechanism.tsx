import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Card} from '../Card';
import {CountUp} from '../CountUp';
import {COLORS, FONT_SANS} from '../../theme';
import {Subheading} from '../Heading';
import {formatEuro} from '../format';

const PriceRow: React.FC<{
	icon: string;
	label: string;
	value: number;
	color: string;
	delay: number;
}> = ({icon, label, value, color, delay}) => (
	<div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
		<div style={{fontSize: 40, marginRight: 20}}>{icon}</div>
		<div style={{flex: 1}}>
			<div
				style={{
					fontFamily: FONT_SANS,
					fontWeight: 700,
					fontSize: 22,
					color: COLORS.darkText,
					opacity: 0.75,
				}}
			>
				{label}
			</div>
			<CountUp
				to={value}
				delay={delay}
				duration={30}
				format={formatEuro}
				style={{
					fontFamily: FONT_SANS,
					fontWeight: 900,
					fontSize: 42,
					color,
				}}
			/>
		</div>
	</div>
);

const RangeRow: React.FC<{
	icon: string;
	label: string;
	low: number;
	high: number;
	color: string;
	delay: number;
}> = ({icon, label, low, high, color, delay}) => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame - delay, [0, 14], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const scale = interpolate(frame - delay, [0, 14], [0.85, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
			<div style={{fontSize: 40, marginRight: 20}}>{icon}</div>
			<div style={{flex: 1}}>
				<div
					style={{
						fontFamily: FONT_SANS,
						fontWeight: 700,
						fontSize: 22,
						color: COLORS.darkText,
						opacity: 0.75,
					}}
				>
					{label}
				</div>
				<div
					style={{
						fontFamily: FONT_SANS,
						fontWeight: 900,
						fontSize: 38,
						color,
						opacity,
						transform: `scale(${scale})`,
						transformOrigin: 'left center',
					}}
				>
					{formatEuro(low)} – {formatEuro(high)}
				</div>
			</div>
		</div>
	);
};

const TOTAL = 320;

export const Mechanism: React.FC = () => {
	const frame = useCurrentFrame();

	const ctaOpacity = interpolate(frame, [190, 208], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const introExit = interpolate(frame, [88, 105], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

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
				padding: '0 60px',
				opacity: exitOpacity,
				transform: `scale(${exitScale})`,
			}}
		>
			<Subheading delay={4} fontSize={32} maxWidth={800}>
				<span style={{opacity: introExit}}>
					Et mécaniquement, les acheteurs ont pu emprunter beaucoup moins.
				</span>
			</Subheading>
			<div style={{height: 36}} />
			<Card delay={95} width={920}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 30}}>
					<PriceRow icon="🏠" label="Prix affiché" value={250000} color={COLORS.darkText} delay={110} />
					<div style={{width: '100%', height: 2, background: COLORS.muted}} />
					<RangeRow icon="💶" label="Financement possible aujourd'hui" low={210000} high={220000} color={COLORS.red} delay={145} />
				</div>
			</Card>
			<div style={{height: 42}} />
			<Subheading delay={0} fontSize={36} maxWidth={800} color={COLORS.white}>
				<span style={{opacity: ctaOpacity}}>👉 Le marché doit s'adapter.</span>
			</Subheading>
		</AbsoluteFill>
	);
};
