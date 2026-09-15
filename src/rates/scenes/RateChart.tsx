import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Card} from '../Card';
import {COLORS, FONT_SANS} from '../../theme';
import {formatPercent} from '../format';

const W = 760;
const H = 320;

const POINTS: Array<{x: number; y: number; year: number; value: number}> = [
	{x: 0, y: 224, year: 2016, value: 1.5},
	{x: 95, y: 230.4, year: 2017, value: 1.4},
	{x: 190, y: 230.4, year: 2018, value: 1.4},
	{x: 285, y: 249.6, year: 2019, value: 1.1},
	{x: 380, y: 256, year: 2020, value: 1.0},
	{x: 475, y: 256, year: 2021, value: 1.0},
	{x: 570, y: 192, year: 2022, value: 2.0},
	{x: 665, y: 70.4, year: 2023, value: 3.9},
	{x: 760, y: 44.8, year: 2024, value: 4.3},
];

const PATH = `M ${POINTS.map((p) => `${p.x} ${p.y}`).join(' L ')}`;
const TOTAL_LENGTH = 883;

const LOW_POINT = POINTS[5];
const END_POINT = POINTS[8];

const DRAW_START = 10;
const DRAW_END = 300;
const TOTAL = 360;

const Caption: React.FC<{
	opacity: number;
	title: string;
}> = ({opacity, title}) => (
	<div
		style={{
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			opacity,
			fontFamily: FONT_SANS,
			fontWeight: 700,
			fontSize: 32,
			color: COLORS.white,
			textAlign: 'center',
			lineHeight: 1.3,
		}}
	>
		{title}
	</div>
);

export const RateChart: React.FC = () => {
	const frame = useCurrentFrame();

	const drawProgress = interpolate(frame, [DRAW_START, DRAW_END], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const dashOffset = TOTAL_LENGTH * (1 - drawProgress);

	const lowFrame = 195;
	const endFrame = 300;

	const lowOpacity = interpolate(frame, [lowFrame, lowFrame + 12], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const endOpacity = interpolate(frame, [endFrame, endFrame + 12], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const capAOpacity = interpolate(
		frame,
		[0, 15, 160, 190],
		[0, 1, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
	const capBOpacity = interpolate(
		frame,
		[175, 205, 345, 360],
		[0, 1, 1, 1],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

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
			<div style={{position: 'relative', width: 820, height: 90}}>
				<Caption opacity={capAOpacity} title="Entre 2016 et 2021, les taux ont fortement baissé, jusqu'à avoisiner 1 %." />
				<Caption opacity={capBOpacity} title="Puis à partir de 2022, les taux sont remontés brutalement, jusqu'à dépasser les 4 %." />
			</div>

			<div style={{height: 30}} />

			<Card delay={0} width={860}>
				<svg width={W + 60} height={H + 50} viewBox={`-40 -20 ${W + 80} ${H + 70}`}>
					{[0, 2, 4].map((pct) => {
						const y = H - (pct / 5) * H;
						return (
							<g key={pct}>
								<line
									x1={0}
									y1={y}
									x2={W}
									y2={y}
									stroke={COLORS.muted}
									strokeWidth={1}
								/>
								<text
									x={-14}
									y={y + 5}
									fontFamily={FONT_SANS}
									fontSize={16}
									fill={COLORS.darkText}
									textAnchor="end"
									opacity={0.7}
								>
									{pct}%
								</text>
							</g>
						);
					})}

					<path
						d={PATH}
						fill="none"
						stroke={COLORS.red}
						strokeWidth={5}
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeDasharray={TOTAL_LENGTH}
						strokeDashoffset={dashOffset}
					/>

					<g opacity={lowOpacity}>
						<circle cx={LOW_POINT.x} cy={LOW_POINT.y} r={9} fill={COLORS.red} stroke={COLORS.white} strokeWidth={3} />
						<text
							x={LOW_POINT.x}
							y={LOW_POINT.y + 34}
							fontFamily={FONT_SANS}
							fontWeight={800}
							fontSize={20}
							fill={COLORS.darkText}
							textAnchor="middle"
						>
							{formatPercent(LOW_POINT.value)}
						</text>
					</g>

					<g opacity={endOpacity}>
						<circle cx={END_POINT.x} cy={END_POINT.y} r={9} fill={COLORS.red} stroke={COLORS.white} strokeWidth={3} />
						<text
							x={END_POINT.x - 10}
							y={END_POINT.y - 20}
							fontFamily={FONT_SANS}
							fontWeight={800}
							fontSize={20}
							fill={COLORS.darkText}
							textAnchor="end"
						>
							{formatPercent(END_POINT.value)}
						</text>
					</g>

					<text
						x={0}
						y={H + 40}
						fontFamily={FONT_SANS}
						fontSize={16}
						fill={COLORS.darkText}
						opacity={0.7}
					>
						2016
					</text>
					<text
						x={W}
						y={H + 40}
						fontFamily={FONT_SANS}
						fontSize={16}
						fill={COLORS.darkText}
						textAnchor="end"
						opacity={0.7}
					>
						2024
					</text>
				</svg>
			</Card>
		</AbsoluteFill>
	);
};
