import 'dotenv/config';
import path from 'path';
import readline from 'readline';
import fs from 'fs';
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
import {
  generateGoogleMapsUrl,
  TravelPlan,
} from '../claude/maps-url-generator';
import { askQuestion } from './util';

const weatherService = new WeatherService();

async function handleToolUse(toolUse: ToolUseBlock): Promise<string | null> {
  let toolResponse: null | string = null;

  // register tool use handle for 2 tools necessary for Travel Planning
  switch (toolUse.name) {
    case CLAUDE_WEATHER_FORECAST_TOOL.name:
      // TODO: handle tool use for weather forecast and potential error
      toolResponse = '';
      break;
    case CLAUDE_GENERATE_MAPS_URL_TOOL.name:
      // TODO: handle tool use for maps url generation and potential error
      toolResponse = '';
      break;
  }
  return toolResponse;
}


// you must provide apikey in the .env file before creating an instance of this service
const chatService = new ClaudeService();

export async function generateTravelPlannerResponse() {
  // use pre-defined prompt imported above or use your own prompt
  const systemPrompt = TRAVEL_PLANNER_SYSTEM_PROMPT;

  // register your tools or leave it empty for testing your raw prompt without any tools
  const tools: Tool[] = [
    CLAUDE_GENERATE_MAPS_URL_TOOL,
    CLAUDE_WEATHER_FORECAST_TOOL,
  ];

  const claudeChat = new ClaudeChat({ prompt: systemPrompt, tools });
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('SIGINT', async () => {
    console.log('\nReadline interface is terminating...');
    if (claudeChat.messages.length) {
      const data = claudeChat.messages
        .map((msg) => {
          if (typeof msg.content === 'string') {
            return msg.content;
          }
          return msg.content
            .map((content) => (content.type === 'text' ? content.text : null))
            .filter(Boolean)
            .join('\n');
        })
        .join('\n');

      const filePath = `./conversation_logs/${new Date().toISOString()}.txt`;
      const dirname = path.dirname(filePath);
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
      }
      fs.writeFileSync(filePath, data);
    }

    rl.close();

    await new Promise((resolve) => setTimeout(resolve, 200));
    process.exit(0);
  });

  while (true) {
    const now = performance.now();

    console.log('\nUser Message:');
    const line = await askQuestion(rl);

    console.log('\n'); // to keep it clean after user input

    // always add your first message to initiate a response
    claudeChat.addMessage({
      role: 'user',
      content: line,
    });

    const response = await chatService.chat({
      claudeChat,
      systemPrompt,
      handleToolUse,
      tools,
    });

    const message = (
      response?.content.find((msg) => msg.type === 'text') as
        | TextBlock
        | undefined
    )?.text;

    // add final response as a message from claude after using tools
    claudeChat.addMessage({
      content: message!,
      role: 'user',
    });

    console.log(
      `\nIt took took ${((performance.now() - now) / 1000).toFixed(
        2
      )}s to receive the message.`
    );
    console.log('\nClaude Response:\n***\n');
    console.log(message);
    console.log('\n***\n');
  }
}
