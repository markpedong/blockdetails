import { setLocalStorage } from '@/utils/xLocalstorage';

export const setCurrency = ({ currency }: { currency: string }) => {
	setLocalStorage('currency', currency);
};
