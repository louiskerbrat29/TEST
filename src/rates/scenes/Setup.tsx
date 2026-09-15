import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Card} from '../Card';
import {COLORS, FONT_SANS} from '../../theme';
import {Subheading} from '../Heading';

const StatBlock: React.FC<{value: string; label: string}> = ({
	value,
	label,
}) => (
	<div style={{textAlign: 'center'}}>
		<div
			style={{
				fontFamily: FONT_SANS,
				fontWeight: 900,
				fontSize: 64,
				color: COLORS.red,
			}}
		>
			{value}
		</div>
		<div
			style={{
				fontFamily: FONT_SANS,
				fontWeight: 700,
				fontSize: 26,
				color: COLORS.darkText,
				marginTop: 6,
			}}
		>
			{label}
		</div>
	</div>
);

export const Setup: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				padding: '0 60px',
			}}
		>
			<Subheading delay={0} fontSize={34} maxWidth={820}>
				Prenons un acheteur qui peut rembourser :
			</Subheading>
			<div style={{height: 40}} />
			<Card delay={18} width={860}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-around',
					}}
				>
					<StatBlock value="1 000 €" label="par mois" />
					<div
						style={{width: 2, height: 90, background: COLORS.muted}}
					/>
					<StatBlock value="20 ans" label="de durée" />
				</div>
			</Card>
		</AbsoluteFill>
	);
};
