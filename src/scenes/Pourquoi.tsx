import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SceneTitle} from './SceneTitle';
import {StaggeredItem} from './StaggeredItem';

const REASONS = [
	'Une expertise locale reconnue',
	"Un réseau de 7 agences dans le Finistère Nord",
	'Un accompagnement personnalisé',
	'Des délais de vente maîtrisés',
];

export const Pourquoi: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				padding: '0 90px',
			}}
		>
			<SceneTitle>Pourquoi choisir le Cabinet Kerjean ?</SceneTitle>
			<div style={{alignSelf: 'flex-start'}}>
				{REASONS.map((reason, i) => (
					<StaggeredItem key={reason} delay={20 + i * 28} fontSize={32}>
						{reason}
					</StaggeredItem>
				))}
			</div>
		</AbsoluteFill>
	);
};
