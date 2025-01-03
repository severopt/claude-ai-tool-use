import { Tool } from "@anthropic-ai/sdk/resources";

export const CLAUDE_GENERATE_MAPS_URL_ERROR_MESSAGE =
  'The provided parameters were invalid. Ask user for clarification and use the tool (generateMapsUrl) again if necessary';

export const CLAUDE_GENERATE_MAPS_URL_TOOL: Tool = {
  name: 'generateMapsUrl',
  description:
    'Generate a Google Maps URL for a travel itinerary with multiple destinations',
  input_schema: {
    type: 'object',
    properties: {
      startingPoint: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the starting location',
          },
          coordinates: {
            type: 'string',
            description:
              "Comma-separated latitude and longitude (e.g., '48.8566,2.3522')",
            pattern: '^-?\\d+\\.\\d+,-?\\d+\\.\\d+$',
          },
        },
        required: ['name', 'coordinates'],
      },
      destinations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the destination',
            },
            coordinates: {
              type: 'string',
              description: 'Comma-separated latitude and longitude',
              pattern: '^-?\\d+\\.\\d+,-?\\d+\\.\\d+$',
            },
            order: {
              type: 'integer',
              description: 'Order of visit in the itinerary (1-based)',
              minimum: 1,
            },
          },
          required: ['name', 'coordinates', 'order'],
        },
        minItems: 1,
        maxItems: 25, // Google Maps has a limit on waypoints
      },
      returnToStart: {
        type: 'boolean',
        description: 'Whether the route should return to the starting point',
        default: false,
      },
      travelMode: {
        type: 'string',
        enum: ['driving', 'walking', 'bicycling', 'transit'],
        description: 'Mode of transportation',
        default: 'driving',
      },
    },
    required: ['startingPoint', 'destinations'],
  },
};
