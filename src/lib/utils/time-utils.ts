/**
 * Formats a date to the nearest hour, e.g. 12 PM
 * @param millisecondsSinceEpoch The date to format
 * @returns The formatted date
 */
export function formatNearestHour(millisecondsSinceEpoch: number): string {
    const date = new Date(millisecondsSinceEpoch);

    // Round to the nearest hour
    let hours = date.getHours();
    const minutes = date.getMinutes();

    if (minutes >= 30) {
        hours++;
    }

    // Adjust for AM/PM
    const isPM = hours >= 12;
    const formattedHour = hours % 12 || 12; // Converts 0 to 12 for 12 AM

    return `${formattedHour} ${isPM ? 'PM' : 'AM'}`;
}

/**
 * Formats a date to the nearest minute, e.g. 12:30 PM
 * @param millisecondsSinceEpoch The date to format
 * @returns The formatted date
 */
export function formatNearestMinute(millisecondsSinceEpoch: number): string {
    const date = new Date(millisecondsSinceEpoch);

    // Extract hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format for AM/PM
    const isPM = hours >= 12;
    const formattedHour = hours % 12 || 12; // Converts 0 to 12 for 12 AM
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHour}:${formattedMinutes} ${isPM ? 'PM' : 'AM'}`;
}
