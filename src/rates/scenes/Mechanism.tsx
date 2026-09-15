import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Card} from '../Card';
import {CountUp} from '../CountUp';
import {COLORS, FONT_SANS} from '../../theme';
import {Subheading} from '../Heading';
import {formatEuro} from '../format';

const Row: React.FC<{
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
				duration={40}
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

export const Mechanism: React.FC = () => {
	const frame = useCurrentFrame();

	const ctaOpacity = interpolate(frame, [130, 150], [0, 1], {
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
			}}
		>
			<Card delay={0} width={900}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 30}}>
					<Row icon="🏠" label="Prix affiché" value={250000} color={COLORS.darkText} delay={15} />
					<div style={{width: '100%', height: 2, background: COLORS.muted}} />
					<Row icon="💶" label="Financement possible aujourd'hui" value={215000} color={COLORS.red} delay={55} />
				</div>
			</Card>
			<div style={{height: 42}} />
			<Subheading delay={0} fontSize={36} maxWidth={800} color={COLORS.white}>
				<span style={{opacity: ctaOpacity}}>👉 Le marché doit s'adapter.</span>
			</Subheading>
		</AbsoluteFill>
	);
};
