import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {Background} from './rates/Background';
import {Hook} from './rates/scenes/Hook';
import {Setup} from './rates/scenes/Setup';
import {BarCompare} from './rates/scenes/BarCompare';
import {BigLoss} from './rates/scenes/BigLoss';
import {RateChart} from './rates/scenes/RateChart';
import {Mechanism} from './rates/scenes/Mechanism';
import {Nuance} from './rates/scenes/Nuance';
import {CtaRates} from './rates/scenes/CtaRates';

export const RatesVideo: React.FC = () => {
	return (
		<AbsoluteFill>
			<Background />
			<Series>
				<Series.Sequence durationInFrames={130}>
					<Hook />
				</Series.Sequence>
				<Series.Sequence durationInFrames={110}>
					<Setup />
				</Series.Sequence>
				<Series.Sequence durationInFrames={180}>
					<BarCompare />
				</Series.Sequence>
				<Series.Sequence durationInFrames={100}>
					<BigLoss />
				</Series.Sequence>
				<Series.Sequence durationInFrames={450}>
					<RateChart />
				</Series.Sequence>
				<Series.Sequence durationInFrames={230}>
					<Mechanism />
				</Series.Sequence>
				<Series.Sequence durationInFrames={130}>
					<Nuance />
				</Series.Sequence>
				<Series.Sequence durationInFrames={180}>
					<CtaRates />
				</Series.Sequence>
			</Series>
		</AbsoluteFill>
	);
};
