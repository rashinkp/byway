import { useEffect, useState, useCallback, useRef } from "react";
import { getPresignedGetUrl } from "@/api/file";

// Fetches a signed GET URL for an S3 key.
// - expiresInSeconds: backend URL expiry
// - autoRefresh: if true, refreshes URL before expiry while the component stays mounted
export function useSignedUrl(key?: string | null, expiresInSeconds: number = 60, autoRefresh: boolean = false) {
	const [url, setUrl] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

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
			
			// Only auto-refresh if explicitly enabled
			if (autoRefresh) {
				if (refreshTimerRef.current) {
					clearTimeout(refreshTimerRef.current);
				}
				refreshTimerRef.current = setTimeout(() => {
					void fetchUrl();
				}, Math.max(5, expiresInSeconds - 10) * 1000);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to get signed URL");
			setUrl("");
		} finally {
			setIsLoading(false);
		}
	}, [key, expiresInSeconds, autoRefresh]);

	useEffect(() => {
		// Clear any existing timer on key/option change
		if (refreshTimerRef.current) {
			clearTimeout(refreshTimerRef.current);
		}

		setUrl("");
		setError(null);
		void fetchUrl();

		return () => {
			if (refreshTimerRef.current) {
				clearTimeout(refreshTimerRef.current);
			}
		};
	}, [key, expiresInSeconds, autoRefresh, fetchUrl]);

	return { url, isLoading, error, refresh: fetchUrl };
}
