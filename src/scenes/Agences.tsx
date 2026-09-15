import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SceneTitle} from './SceneTitle';
import {StaggeredItem} from './StaggeredItem';

const TOWNS = [
	'Landerneau',
	'Lesneven',
	'Landivisiau',
	'Morlaix',
	'Locquirec',
	'Carantec',
	'Lannilis',
];

export const Agences: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				padding: '0 90px',
			}}
		>
			<SceneTitle>7 agences dans le Finistère Nord</SceneTitle>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					columnGap: 60,
				}}
			>
				{TOWNS.map((town, i) => (
					<StaggeredItem key={town} delay={20 + i * 12} fontSize={30}>
						{town}
					</StaggeredItem>
				))}
			</div>
		</AbsoluteFill>
	);
};
