const DATA_URL_PATTERN = /^data:([^;,]+)(;base64)?,([\s\S]*)$/;

export function isDataUrl(value: string | null | undefined): value is string {
    return typeof value === 'string' && DATA_URL_PATTERN.test(value);
}

export function decodeDataUrl(dataUrl: string) {
    const match = dataUrl.match(DATA_URL_PATTERN);
    if (!match) return null;

    const [, contentType, base64Flag, payload] = match;
    const body = base64Flag
        ? Buffer.from(payload, 'base64')
        : Buffer.from(decodeURIComponent(payload));

    return {
        body,
        contentType,
    };
}
