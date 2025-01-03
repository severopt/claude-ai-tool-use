/**
   * Provides current time in ISO 8601 format for the given timezone.
   * If the provided timezone is not valid, then it throws an error.
   * Example result:
   * `2024-12-30T13:15:16GMT+1`
   */
export function getTimeByTimezone({ timezone }: { timezone: string }): string {
  try {
    const trimmedTimezone = timezone?.trim();
    if (!trimmedTimezone) {
      throw new Error('Timezone is required');
    }

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: trimmedTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'shortOffset',
    });

    const parts = formatter.formatToParts(new Date());
    const formattedDate = `${parts.find((p) => p.type === 'year')?.value}-${
      parts.find((p) => p.type === 'month')?.value
    }-${parts.find((p) => p.type === 'day')?.value}T${
      parts.find((p) => p.type === 'hour')?.value
    }:${parts.find((p) => p.type === 'minute')?.value}:${
      parts.find((p) => p.type === 'second')?.value
    }${parts.find((p) => p.type === 'timeZoneName')?.value}`;
    return formattedDate;
  } catch (error) {
    throw new Error(`Invalid timezone: ${timezone}`);
  }
}