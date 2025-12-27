'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

interface DataCacheContextType {
    get: <T>(key: string) => T | null;
    set: <T>(key: string, data: T) => void;
    has: (key: string) => boolean;
    invalidate: (key: string) => void;
    invalidateAll: () => void;
}

const DataCacheContext = createContext<DataCacheContextType | null>(null);

// Cache duration: 5 minutes (in milliseconds)
const CACHE_DURATION = 5 * 60 * 1000;

export function DataCacheProvider({ children }: { children: ReactNode }) {
    const [cache, setCache] = useState<Map<string, CacheEntry<unknown>>>(new Map());

    const get = useCallback(<T,>(key: string): T | null => {
        const entry = cache.get(key);
        if (!entry) return null;

        // Check if cache is still valid
        if (Date.now() - entry.timestamp > CACHE_DURATION) {
            // Cache expired, remove it
            setCache(prev => {
                const next = new Map(prev);
                next.delete(key);
                return next;
            });
            return null;
        }

        return entry.data as T;
    }, [cache]);

    const set = useCallback(<T,>(key: string, data: T): void => {
        setCache(prev => {
            const next = new Map(prev);
            next.set(key, { data, timestamp: Date.now() });
            return next;
        });
    }, []);

    const has = useCallback((key: string): boolean => {
        const entry = cache.get(key);
        if (!entry) return false;
        return Date.now() - entry.timestamp <= CACHE_DURATION;
    }, [cache]);

    const invalidate = useCallback((key: string): void => {
        setCache(prev => {
            const next = new Map(prev);
            next.delete(key);
            return next;
        });
    }, []);

    const invalidateAll = useCallback((): void => {
        setCache(new Map());
    }, []);

    return (
        <DataCacheContext.Provider value={{ get, set, has, invalidate, invalidateAll }}>
            {children}
        </DataCacheContext.Provider>
    );
}

export function useDataCache() {
    const context = useContext(DataCacheContext);
    if (!context) {
        throw new Error('useDataCache must be used within a DataCacheProvider');
    }
    return context;
}

// Custom hook for cached fetch
export function useCachedFetch<T>(key: string, fetchFn: () => Promise<T>) {
    const cache = useDataCache();
    const [data, setData] = useState<T | null>(() => cache.get<T>(key));
    const [loading, setLoading] = useState(!cache.has(key));
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        // If we already have cached data, don't fetch
        if (cache.has(key)) {
            const cachedData = cache.get<T>(key);
            if (cachedData) {
                setData(cachedData);
                setLoading(false);
                return;
            }
        }

        // Fetch data
        setLoading(true);
        fetchFn()
            .then((result) => {
                cache.set(key, result);
                setData(result);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : 'Unknown error');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [key, fetchFn, cache]);

    return { data, loading, error };
}
