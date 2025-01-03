import 'dotenv/config';
import readline from 'readline';
import { Tool, ToolUseBlock, TextBlock } from '@anthropic-ai/sdk/resources';
import { ClaudeChat } from '../claude/claude-chat';
import {
  CLAUDE_CURRENT_TIME_TOOL,
  CLAUDE_CURRENT_TIME_ERROR_MESSAGE,
} from '../claude/tools';
import { ClaudeService } from '../claude/claude.service';
import { getTimeByTimezone } from '../claude/current-time.service';
import { askQuestion } from './util';

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
  systemPrompt = '',
  useTools = false,
}: {
  systemPrompt?: string;
  useTools?: boolean;
}) {
  // register your tools or leave it empty for testing your raw prompt without any tools
  const tools: Tool[] = useTools ? [CLAUDE_CURRENT_TIME_TOOL] : [];

  const claudeChat = new ClaudeChat({ prompt: systemPrompt, tools });
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.on('SIGINT', async () => {
    console.log('\nReadline interface is terminating...');
    rl.close();
    process.exit(0);
  });

  while (true) {
    const now = performance.now();

    console.log('\nUser Message:');
    const line = await askQuestion(rl);

    console.log('\nMock time? (empty if you want the AI to use real current time)');
    const mockTimeResponse = await askQuestion(rl);

    claudeChat.addMessage({
      role: 'user',
      content: line,
    });

    const response = await chatService.chat({
      claudeChat,
      systemPrompt,
      handleToolUse: mockTimeResponse
        ? () => Promise.resolve(mockTimeResponse)
        : handleToolUse,
      tools,
    });

    const message = (
      response?.content.find((msg) => msg.type === 'text') as
        | TextBlock
        | undefined
    )?.text;
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
