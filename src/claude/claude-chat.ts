import { MessageParam, Tool } from '@anthropic-ai/sdk/resources';

interface TokenUsages {
  inputTokens: number;
  outputTokens: number;
}

export class ClaudeChat {
  messages: MessageParam[] = [];
  /** system prompt */
  prompt: string;
  tools: Tool[];
  inputTokenUsage = 0;
  outputTokenUsage = 0;

  constructor({prompt, tools}: {prompt: string, tools: Tool[]}) {
    this.prompt = prompt;
    this.tools = tools;
  }

  addMessage(message: MessageParam): void {
    this.messages.push(message);
  }

  trackTokenUsage({ inputTokens, outputTokens }: TokenUsages): void {
    this.inputTokenUsage += inputTokens;
    this.outputTokenUsage += outputTokens;
  }
}
