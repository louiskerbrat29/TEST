import React from 'react';
import {Composition} from 'remotion';
import {MyComp} from './MyComp';
import {Presentation} from './Presentation';

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
		</>
	);
};
