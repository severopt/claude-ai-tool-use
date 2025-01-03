import 'dotenv/config';
import { Tool, ToolUseBlock, TextBlock } from '@anthropic-ai/sdk/resources';
import { ClaudeChat } from '../claude/claude-chat';
import {
  CLAUDE_CURRENT_TIME_TOOL,
  CLAUDE_CURRENT_TIME_ERROR_MESSAGE,
} from '../claude/tools';
import { ClaudeService } from '../claude/claude.service';
import { getTimeByTimezone } from '../claude/current-time.service';

async function handleToolUse(toolUse: ToolUseBlock): Promise<string> {
  const input = toolUse.input as { timezone: string };
  try {
    // return getTimeByTimezone(input);
    return getTimeByTimezone(input);
  } catch (err) {
    console.error(`Error processing ${CLAUDE_CURRENT_TIME_TOOL.name} tool.`);
    return CLAUDE_CURRENT_TIME_ERROR_MESSAGE;
  }
}

// you must provide apikey in the .env file before creating an instance of this service
const chatService = new ClaudeService();

export async function generateResponseWithCurrentTimeTool({
  userMessage,
  systemPrompt = '',
  useTools = false,
  mockTimeResponse,
}: {
  systemPrompt?: string;
  userMessage: string;
  useTools?: boolean;
  mockTimeResponse?: string;
}) {
  // register your tools or leave it empty for testing your raw prompt without any tools
  const tools: Tool[] = useTools ? [CLAUDE_CURRENT_TIME_TOOL] : [];

  const chat = new ClaudeChat({ prompt: systemPrompt, tools });

  // always add your first message to initiate a response
  chat.addMessage({
    role: 'user',
    content: userMessage,
  });

  const response = await chatService.chat({
    messages: chat.messages,
    systemPrompt,
    handleToolUse: mockTimeResponse
      ? () => Promise.resolve(mockTimeResponse)
      : handleToolUse,
    tools,
  });

  const message = (response?.content.find((msg) => msg.type === 'text') as TextBlock | undefined)?.text;
  console.log('\n***\n\nClaude Response:');
  console.log(message);
  console.log('\n***\n');
}
