import type { JsonValue } from "type-fest";

const defaultItem = { data: undefined, ttl: Number.NEGATIVE_INFINITY };

export const storageWithTTL = {
	setItem<Value extends JsonValue>(key: string, value: Value, ttl: number) {
		localStorage.setItem(
			key,
			JSON.stringify({ data: value, ttl: Date.now() + ttl }),
		);
	},
	getItem<Value extends JsonValue>(key: string) {
		try {
			const item = JSON.parse(
				localStorage.getItem(key) ?? JSON.stringify({ ttl: 0 }),
			) as { data: Value; ttl: number };

			if (item.ttl < Date.now()) {
				localStorage.removeItem(key);

				return defaultItem;
			}

			return item;
		} catch (error) {
			console.error(`Error while trying to read ${key}:`, error);

			return defaultItem;
		}
	},
};
