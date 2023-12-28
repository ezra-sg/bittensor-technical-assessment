export function shapeQueryParams(params: Record<string, string>): string {
    return Object.entries(params ?? {})
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
}
