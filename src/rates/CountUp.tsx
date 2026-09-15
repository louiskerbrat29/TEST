import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export const CountUp: React.FC<{
	from?: number;
	to: number;
	delay?: number;
	duration?: number;
	format: (n: number) => string;
	style?: React.CSSProperties;
}> = ({from = 0, to, delay = 0, duration = 35, format, style}) => {
	const frame = useCurrentFrame();
	const value = interpolate(frame - delay, [0, duration], [from, to], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return <div style={style}>{format(value)}</div>;
};
