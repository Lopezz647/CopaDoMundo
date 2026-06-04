const isNode = typeof window === 'undefined';

// Imitação do localStorage para o servidor (SSR)
const mockStorage = {
  getItem: (key: string) => null,
  setItem: (key: string, value: string) => {},
  removeItem: (key: string) => {},
  clear: () => {}
} as unknown as Storage;

const windowObj = isNode ? { location: { href: '' }, localStorage: mockStorage } : (window as any);
const storage = windowObj.localStorage;

const toSnakeCase = (str: string) => {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

const getAppParamValue = (
    paramName: string, 
    { defaultValue = undefined, removeFromUrl = false }: { defaultValue?: any, removeFromUrl?: boolean } = {}
) => {
	if (isNode) {
		return defaultValue;
	}
	const storageKey = `base44_${toSnakeCase(paramName)}`;
	const urlParams = new URLSearchParams(window.location.search);
	const searchParam = urlParams.get(paramName);
	if (removeFromUrl) {
		urlParams.delete(paramName);
		const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""
			}${window.location.hash}`;
		window.history.replaceState({}, document.title, newUrl);
	}
	if (searchParam) {
		storage.setItem(storageKey, searchParam);
		return searchParam;
	}
	if (defaultValue) {
		storage.setItem(storageKey, defaultValue);
		return defaultValue;
	}
	const storedValue = storage.getItem(storageKey);
	if (storedValue) {
		return storedValue;
	}
	return null;
}

const getAppParams = () => {
	if (getAppParamValue("clear_access_token") === 'true') {
		storage.removeItem('base44_access_token');
		storage.removeItem('token');
	}
    
	return {
		appId: getAppParamValue("app_id", { defaultValue: process.env.NEXT_PUBLIC_BASE44_APP_ID }),
		token: getAppParamValue("access_token", { removeFromUrl: true }),
		fromUrl: getAppParamValue("from_url", { defaultValue: windowObj.location?.href }),
		functionsVersion: getAppParamValue("functions_version", { defaultValue: process.env.NEXT_PUBLIC_BASE44_FUNCTIONS_VERSION }),
		appBaseUrl: getAppParamValue("app_base_url", { defaultValue: process.env.NEXT_PUBLIC_BASE44_APP_BASE_URL }),
	}
}

export const appParams = {
	...getAppParams()
}
