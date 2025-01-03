import { Tool } from '@anthropic-ai/sdk/resources';

export const CLAUDE_CURRENT_TIME_ERROR_MESSAGE =
  '`timezone` parameter does not exist or is an invalid value. Ask user for clarification and use the tool (getCurrentTime) again if necessary';

export const CLAUDE_CURRENT_TIME_TOOL: Tool = {
  name: 'getCurrentTime' as const,
  description:
    'Returns current time in specified timezone. Requires IANA timezone identifier (e.g., "America/New_York", "Europe/London"). Returns time in "HH:mm:ss" 24-hour format. For location queries (city/country), assistant maps to corresponding IANA timezone. Assistant requests clarification if timezone/location is ambiguous. Throws error for invalid timezones.',
  input_schema: {
    type: 'object',
    properties: {
      timezone: {
        type: 'string',
        description: 'IANA timezone identifier for Intl.DateTimeFormat',
        examples: ['America/New_York', 'Asia/Tokyo', 'Europe/Berlin'],
      },
    },
    required: ['timezone'],
  },
};
