import { useEffect, useState, useCallback } from "react";
import { getPresignedGetUrl } from "@/api/file";

export function useSignedUrl(key?: string | null, expiresInSeconds: number = 60) {
	const [url, setUrl] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUrl = useCallback(async () => {
		if (!key) {
			setUrl("");
			return;
		}
		setIsLoading(true);
		setError(null);
		try {
			const signed = await getPresignedGetUrl(key, expiresInSeconds);
			setUrl(signed);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to get signed URL");
			setUrl("");
		} finally {
			setIsLoading(false);
		}
	}, [key, expiresInSeconds]);

	useEffect(() => {
		void fetchUrl();
	}, [fetchUrl]);

	return { url, isLoading, error, refresh: fetchUrl };
}
