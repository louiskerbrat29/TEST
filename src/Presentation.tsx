import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {COLORS} from './theme';
import {Intro} from './scenes/Intro';
import {Agences} from './scenes/Agences';
import {Services} from './scenes/Services';
import {Pourquoi} from './scenes/Pourquoi';
import {Cta} from './scenes/Cta';

export const Presentation: React.FC = () => {
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: COLORS.grey, height: '45%'}} />
			<AbsoluteFill
				style={{background: COLORS.red, top: '45%', height: '55%'}}
			/>
			<Series>
				<Series.Sequence durationInFrames={90}>
					<Intro />
				</Series.Sequence>
				<Series.Sequence durationInFrames={240}>
					<Agences />
				</Series.Sequence>
				<Series.Sequence durationInFrames={330}>
					<Services />
				</Series.Sequence>
				<Series.Sequence durationInFrames={270}>
					<Pourquoi />
				</Series.Sequence>
				<Series.Sequence durationInFrames={120}>
					<Cta />
				</Series.Sequence>
			</Series>
		</AbsoluteFill>
	);
};
