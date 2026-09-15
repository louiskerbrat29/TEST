import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONT_SANS} from '../theme';

const Blob: React.FC<{
	size: number;
	top: number;
	left: number;
	color: string;
	opacity: number;
	speed: number;
	phase: number;
}> = ({size, top, left, color, opacity, speed, phase}) => {
	const frame = useCurrentFrame();
	const dx = Math.sin(frame / speed + phase) * 40;
	const dy = Math.cos(frame / speed + phase) * 30;

	return (
		<div
			style={{
				position: 'absolute',
				top,
				left,
				width: size,
				height: size,
				borderRadius: '50%',
				background: color,
				opacity,
				filter: 'blur(60px)',
				transform: `translate(${dx}px, ${dy}px)`,
			}}
		/>
	);
};

export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const wobble = Math.sin(frame / 130) * 5;
	const topPct = 42 + wobble;

	return (
		<AbsoluteFill style={{background: COLORS.greyDark, overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					clipPath: `polygon(0 ${topPct + 6}%, 100% ${topPct - 6}%, 100% 100%, 0% 100%)`,
					background: `linear-gradient(160deg, ${COLORS.red} 0%, ${COLORS.redDark} 100%)`,
				}}
			/>
			<Blob
				size={520}
				top={-120}
				left={-140}
				color={COLORS.grey}
				opacity={0.5}
				speed={85}
				phase={0}
			/>
			<Blob
				size={420}
				top={200}
				left={720}
				color={COLORS.red}
				opacity={0.25}
				speed={65}
				phase={2}
			/>
			<Blob
				size={360}
				top={1400}
				left={-100}
				color={COLORS.redDark}
				opacity={0.3}
				speed={95}
				phase={4}
			/>

			<div
				style={{
					position: 'absolute',
					top: 64,
					left: 0,
					right: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						background: 'rgba(255,255,255,0.94)',
						borderRadius: 999,
						padding: '10px 28px 10px 10px',
						boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
					}}
				>
					<Img
						src={staticFile('logo.jpg')}
						style={{width: 44, height: 44, borderRadius: '50%', objectFit: 'cover'}}
					/>
					<div
						style={{
							marginLeft: 14,
							color: COLORS.darkText,
							fontFamily: FONT_SANS,
							fontWeight: 900,
							fontSize: 26,
							letterSpacing: 0.3,
						}}
					>
						Cabinet Kerjean
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
