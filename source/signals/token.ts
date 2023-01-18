import { storageWithTTL } from "../utils/storage-with-ttl.js";
import { createSignal } from "solid-js";

export const [token, setToken] = createSignal(
	storageWithTTL.getItem<string>("token").data,
);
