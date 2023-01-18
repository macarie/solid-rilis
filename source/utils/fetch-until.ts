import ky from "ky";

import type { Options } from "ky";
import type { z } from "zod";

type FetchUntilOptions<TSchema extends z.ZodObject<z.ZodRawShape>> = {
	endpoint: string;
	// eslint-disable-next-line @typescript-eslint/ban-types
	getNextEndpoint: (data: z.infer<TSchema>) => string | null;
	kyOptions: Options;
	schema: TSchema;
};

/**
 * Fetch an endpoint and all its next pages until `getNextEndpoint` returns
 * `null`.
 *
 * Each response is validated against the schema.
 *
 * The return value is an array containing every page that was fetched.
 */
export const fetchUntil = async <TSchema extends z.ZodObject<z.ZodRawShape>>({
	endpoint,
	getNextEndpoint,
	kyOptions,
	schema,
}: FetchUntilOptions<TSchema>) => {
	const responses: Array<z.infer<TSchema>> = [];

	let nextURL: ReturnType<typeof getNextEndpoint> = endpoint;

	do {
		// eslint-disable-next-line no-await-in-loop
		const response = schema.parse(await ky.get(nextURL, kyOptions).json());

		responses.push(response);

		nextURL = getNextEndpoint(response);
	} while (nextURL !== null);

	return responses;
};
