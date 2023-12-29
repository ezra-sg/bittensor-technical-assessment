/**
 * Shape query params to a string like `key1=value1&key2=value2`
 * @param params - query params
 * @returns query params string
 */
export function shapeQueryParams(params: Record<string, string>): string {
    return Object.entries(params ?? {})
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
}

/**
 * Format currency to a string like `1,000,000.00`
 * @param num - number to format
 * @returns formatted currency string
 */
export function formatCurrency(num: number) {
    return num.toLocaleString('en-US', {
        maximumFractionDigits: 4,
    });
}
