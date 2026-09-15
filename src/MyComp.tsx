import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

export const MyComp: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const checkScale = spring({
		fps,
		frame,
		config: {damping: 200},
	});

	const titleOpacity = interpolate(frame, [10, 30], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const subtitleOpacity = interpolate(frame, [35, 55], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: 'Helvetica, Arial, sans-serif',
			}}
		>
			<div
				style={{
					width: 160,
					height: 160,
					borderRadius: '50%',
					background: '#22c55e',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					transform: `scale(${checkScale})`,
					marginBottom: 48,
				}}
			>
				<svg width="80" height="80" viewBox="0 0 24 24" fill="none">
					<path
						d="M4 12.5L9.5 18L20 6"
						stroke="white"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>
			<div
				style={{
					color: 'white',
					fontSize: 64,
					fontWeight: 700,
					opacity: titleOpacity,
				}}
			>
				Skill Remotion installe
			</div>
			<div
				style={{
					color: '#94a3b8',
					fontSize: 32,
					marginTop: 16,
					opacity: subtitleOpacity,
				}}
			>
				Cette video a ete rendue avec Remotion
			</div>
		</AbsoluteFill>
	);
};
