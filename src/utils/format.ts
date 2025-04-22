/**
 * Formats a duration in minutes into a human-readable string
 * @param minutes - Duration in minutes
 * @returns Formatted string (e.g. "30 min", "1h 30m", "2h")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Formats a 24-hour time string into a 12-hour format with AM/PM
 * @param time - Time in "HH:mm" format (24hr)
 * @returns Formatted string (e.g. "9:30 AM", "2:15 PM")
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Converts a time string in "HH:mm" format to decimal hours
 * @param time - Time in "HH:mm" format (24hr)
 * @returns Decimal hours (e.g. "09:30" -> 9.5)
 */
export function timeToDecimal(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  if (hours < 0 || minutes < 0 || minutes >= 60) {
    throw new Error('Time must be in valid 24-hour "HH:mm" format');
  }
  return hours + minutes / 60;
} 