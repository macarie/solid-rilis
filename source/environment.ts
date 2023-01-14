import { z } from "zod";

const schema = z.object({
	VITE_SPOTIFY_CLIENT_ID: z.string(),
	VITE_SPOTIFY_REDIRECT_URI: z.string().url(),
});

export const environment = schema.parse(import.meta.env);
