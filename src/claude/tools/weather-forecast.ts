import { Tool } from '@anthropic-ai/sdk/resources';

const errorResponse = {
  status: 'error',
  message: '',
};

export const CLAUDE_WEATHER_FORECAST_ERROR_MESSAGE =
  JSON.stringify(errorResponse);

export const CLAUDE_WEATHER_FORECAST_TOOL: Tool = {
  name: 'getWeatherForecast',
  description:
    'Retrieves weather forecast for the next week for a location. Provides temperature (min, max) and weather conditions (sunny, rainy, etc.) for the next 7 days of the exact moment of the request. The city and country parameters must be valid values. It should be used when the user asks about the current weather status in a city or a district. When the user provides a city, there is no need to provide the district name, but the relevant country should always be provided by the AI assistant. When the user provides a district, the AI assistant provides the relevant city name and country name as described in the parameters.',
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
