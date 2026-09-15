import React from 'react';
import {Composition} from 'remotion';
import {MyComp} from './MyComp';
import {Presentation} from './Presentation';
import {RatesVideo} from './RatesVideo';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComp}
				durationInFrames={90}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
			<Composition
				id="Presentation"
				component={Presentation}
				durationInFrames={1050}
				width={1080}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
			<Composition
				id="RatesVideo"
				component={RatesVideo}
				durationInFrames={1510}
				width={1080}
				height={1920}
				fps={30}
				defaultProps={{}}
			/>
		</>
	);
};
