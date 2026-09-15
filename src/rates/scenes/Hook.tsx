import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Heading, Subheading} from '../Heading';

export const Hook: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				padding: '0 70px',
			}}
		>
			<Heading delay={5} fontSize={62}>
				Pourquoi les prix de l'immobilier ont-ils baissé ces dernières
				années&nbsp;?
			</Heading>
			<div style={{height: 44}} />
			<Subheading delay={40} fontSize={36}>
				👉 Regardez ce qui s'est passé avec les taux de crédit.
			</Subheading>
		</AbsoluteFill>
	);
};
