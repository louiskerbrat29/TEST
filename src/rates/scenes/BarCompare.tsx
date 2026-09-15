import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Card} from '../Card';
import {CountUp} from '../CountUp';
import {COLORS, FONT_SANS} from '../../theme';
import {Subheading} from '../Heading';
import {formatEuro} from '../format';

const MAX_VALUE = 220000;
const MAX_HEIGHT = 340;
const TOTAL = 180;

const Bar: React.FC<{
	value: number;
	label: string;
	color: string;
	growDelay: number;
}> = ({value, label, color, growDelay}) => {
	const frame = useCurrentFrame();
	const height = interpolate(
		frame - growDelay,
		[0, 32],
		[0, (value / MAX_VALUE) * MAX_HEIGHT],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				width: 220,
			}}
		>
			<div
				style={{
					height: MAX_HEIGHT,
					display: 'flex',
					alignItems: 'flex-end',
				}}
			>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<CountUp
						to={value}
						delay={growDelay}
						duration={32}
						format={formatEuro}
						style={{
							fontFamily: FONT_SANS,
							fontWeight: 900,
							fontSize: 30,
							color: COLORS.darkText,
							marginBottom: 10,
						}}
					/>
					<div
						style={{
							width: 96,
							height,
							background: color,
							borderRadius: '10px 10px 0 0',
						}}
					/>
				</div>
			</div>
			<div style={{width: 140, height: 3, background: COLORS.darkText, marginTop: 2}} />
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					marginTop: 14,
				}}
			>
				<div
					style={{
						width: 14,
						height: 14,
						borderRadius: '50%',
						background: color,
						marginRight: 8,
					}}
				/>
				<div
					style={{
						fontFamily: FONT_SANS,
						fontWeight: 700,
						fontSize: 24,
						color: COLORS.darkText,
					}}
				>
					{label}
				</div>
			</div>
		</div>
	);
};

export const BarCompare: React.FC = () => {
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
				padding: '0 50px',
				opacity: exitOpacity,
				transform: `scale(${exitScale})`,
			}}
		>
			<Subheading delay={0} fontSize={32} maxWidth={840}>
				Montant empruntable pour 1 000 €/mois sur 20 ans
			</Subheading>
			<div style={{height: 36}} />
			<Card delay={10} width={920}>
				<div
					style={{
						display: 'flex',
						alignItems: 'flex-end',
						justifyContent: 'space-around',
					}}
				>
					<Bar value={217000} label="Taux à 1 %" color={COLORS.grey} growDelay={16} />
					<Bar value={165000} label="Taux à 4 %" color={COLORS.red} growDelay={48} />
				</div>
			</Card>
		</AbsoluteFill>
	);
};
