import { getLocalStorage, setLocalStorage } from '@/utils/xLocalstorage';

export const setCurrency = ({ currency } = { currency: 'USD' }) => {
	setLocalStorage('currency', currency);
};
