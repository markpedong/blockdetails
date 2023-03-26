import numeral from 'numeral';

export const formatNumber = (num: number, format: string = '0,0') => {
	return numeral(num).format(format);
};
