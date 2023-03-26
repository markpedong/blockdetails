import { compress, decompress } from 'lz-string';
import { isArray, isObject } from 'lodash';

export const setLocalStorage = (key: string, value: string | object | [any]) => {
	if (isObject(value) || isArray(value)) {
		JSON.stringify(value);
	}

	localStorage[compress(key)] = compress(value as string);
};

export const getLocalStorage = (key: string) => {
	try {
		let value = decompress(key);

		console.log(value);

		value = JSON.parse(value);

		return value;
	} catch {}
};
