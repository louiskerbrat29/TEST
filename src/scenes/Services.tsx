import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SceneTitle} from './SceneTitle';
import {StaggeredItem} from './StaggeredItem';

const SERVICES = [
	'Estimation de votre bien',
	'Mandat de vente',
	'Home staging',
	"Accompagnement de l'offre à la signature",
	'Conseil en investissement immobilier',
	'Accompagnement dans vos projets immobiliers',
];

export const Services: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				padding: '0 90px',
			}}
		>
			<SceneTitle>Nos services</SceneTitle>
			<div style={{alignSelf: 'flex-start'}}>
				{SERVICES.map((service, i) => (
					<StaggeredItem key={service} delay={20 + i * 25} fontSize={30}>
						{service}
					</StaggeredItem>
				))}
			</div>
		</AbsoluteFill>
	);
};
