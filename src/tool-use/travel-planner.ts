import 'dotenv/config';
import { Tool, ToolUseBlock, TextBlock } from '@anthropic-ai/sdk/resources';
import { ClaudeChat } from '../claude/claude-chat';
import {
  CLAUDE_GENERATE_MAPS_URL_TOOL,
  CLAUDE_WEATHER_FORECAST_TOOL,
  CLAUDE_GENERATE_MAPS_URL_ERROR_MESSAGE,
  CLAUDE_WEATHER_FORECAST_ERROR_MESSAGE,
} from '../claude/tools';
import { ClaudeService } from '../claude/claude.service';

import { TRAVEL_PLANNER_SYSTEM_PROMPT } from '../system-prompts';
import {
  GetWeatherByLocationArguments,
  WeatherService,
} from '../claude/weather.service';
import { generateGoogleMapsUrl, TravelPlan } from '../claude/maps-url-generator';

const weatherService = new WeatherService();

async function handleToolUse(toolUse: ToolUseBlock): Promise<string | null> {
  let toolResponse: null | string = null;

  // register tool use handle for 2 tools necessary for Travel Planning
  switch (toolUse.name) {
    case CLAUDE_WEATHER_FORECAST_TOOL.name:
      // TODO: assign weather response or api error as string to `toolResponse`
      toolResponse = 'weather response';
      break;
    case CLAUDE_GENERATE_MAPS_URL_TOOL.name:
      toolResponse = 'weather response';
      // TODO: assign google maps url or api error as string to `toolResponse`
      break;
  }
  return toolResponse;
}

// you must provide apikey in the .env file before creating an instance of this service
const chatService = new ClaudeService();

export async function generateTravelPlannerResponse(userMessage: string) {
  // use pre-defined prompt imported above or use your own prompt
  const systemPrompt = TRAVEL_PLANNER_SYSTEM_PROMPT;

  // register your tools or leave it empty for testing your raw prompt without any tools
  const tools: Tool[] = [
    CLAUDE_GENERATE_MAPS_URL_TOOL,
    CLAUDE_WEATHER_FORECAST_TOOL,
  ];

  const chat = new ClaudeChat({ prompt: systemPrompt, tools });

  // always add your first message to initiate a response
  chat.addMessage({
    role: 'user',
    content: userMessage,
  });

  const response = await chatService.chat({
    messages: chat.messages,
    systemPrompt,
    handleToolUse,
    tools,
  });

  const message = (response?.content.find((msg) => msg.type === 'text') as TextBlock | undefined)?.text;
  console.log('\n***\nClaude Response:');
  console.log(message);
}
