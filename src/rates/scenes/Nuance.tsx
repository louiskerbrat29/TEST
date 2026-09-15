import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Heading, Subheading} from '../Heading';
import {COLORS} from '../../theme';

export const Nuance: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				padding: '0 80px',
			}}
		>
			<div style={{fontSize: 56}}>🔍</div>
			<div style={{height: 28}} />
			<Subheading delay={10} fontSize={32} maxWidth={780} color={COLORS.white}>
				Bien sûr, les taux ne sont pas le seul facteur.
			</Subheading>
			<div style={{height: 26}} />
			<Heading delay={45} fontSize={42} maxWidth={820}>
				Mais pour comprendre les prix, regardez toujours la capacité
				d'emprunt des acheteurs.
			</Heading>
		</AbsoluteFill>
	);
};
