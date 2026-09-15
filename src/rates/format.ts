export const formatEuro = (value: number): string => {
	const rounded = Math.round(value);
	const withSpaces = rounded
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	return `${withSpaces} €`;
};

export const formatPercent = (value: number): string => {
	return `${value.toFixed(1).replace('.', ',')} %`;
};
