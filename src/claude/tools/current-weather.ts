import { Tool } from '@anthropic-ai/sdk/resources';

const errorResponse = {
  status: 'error',
  message:
    'There was an error with the Weather Tool (getCurrentWeather). Either no location was found for the provided city/district, or there was a problem with the external API call.',
};

export const CLAUDE_CURRENT_WEATHER_ERROR_MESSAGE = JSON.stringify(errorResponse);

export const CLAUDE_CURRENT_WEATHER_TOOL: Tool = {
  name: 'getCurrentWeather',
  description:
    'Retrieves current weather information for a location. Provides real-time temperature and weather conditions (sunny, rainy, etc.) for the exact moment of the request. The city and country parameters must be valid values. It should be used when the user asks about the current weather status in a city or a district. When the user provides a city, there is no need to provide the district name, but the relevant country should always be provided by the AI assistant. When the user provides a district, the AI assistant provides the relevant city name and country name as described in the parameters. If the district provided by the user is ambiguous, then the AI assistant does not use this tool (function call), but first asks for clarification from the user.',
  input_schema: {
    type: 'object',
    properties: {
      city: {
        type: 'string',
        description: 'City name',
      },
      country: {
        type: 'string',
        description: 'Country name',
      },
      district: {
        type: 'string',
        description: 'District/region name (optional)',
      },
    },
    required: ['city', 'country'],
  },
};
