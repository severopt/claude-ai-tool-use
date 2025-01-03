import { Tool } from '@anthropic-ai/sdk/resources';

const errorResponse = {
  status: 'error',
  message: '',
};

export const CLAUDE_WEATHER_FORECAST_ERROR_MESSAGE =
  JSON.stringify(errorResponse);

export const CLAUDE_WEATHER_FORECAST_TOOL: Tool = {
  name: 'getWeatherForecast',
  // TODO: add tool definition here:
  description: '',
  input_schema: {},
};
