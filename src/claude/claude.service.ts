import Anthropic from '@anthropic-ai/sdk';
import { Tool, ToolUseBlock } from '@anthropic-ai/sdk/resources';

export class ClaudeService {
  private readonly client: Anthropic;
  private readonly model: string;
  private readonly maxTokens = 3000; // limit is `8192`

  constructor() {
    const apiKey = process.env.CLAUDE_API_KEY;
    this.model = process.env.CLAUDE_AI_MODEL || 'claude-3-5-sonnet-20241022';
    if (!apiKey) {
      throw new Error('Claude api key was not provided');
    }
    if (!this.model) {
      throw new Error('Claude model was not provided');
    }
    this.client = new Anthropic({ apiKey });
  }

  async chat({
    messages,
    systemPrompt,
    tools = [],
    handleToolUse,
  }: {
    systemPrompt: string;
    messages: Anthropic.Messages.MessageParam[];
    tools?: Tool[];
    handleToolUse: (response: ToolUseBlock) => Promise<string | null>;
  }): Promise<Anthropic.Messages.Message | null> {
    try {
      const aiResponse = await this.client.messages.create({
        system: systemPrompt,
        model: this.model,
        max_tokens: this.maxTokens,
        tools,
        messages,
      });

      // if the AI assistant is requesting tool use, then we should return with a proper response
      // and re-request a response from AI assistant
      const toolUse = aiResponse.content.find((msg) => msg.type == 'tool_use');
      if (!toolUse) return aiResponse;

      // Add tool result message
      const toolResponse = await handleToolUse(toolUse);
      if (!toolResponse) return aiResponse;

      // Add tool use request message so that AI knows the chat history
      messages.push({
        role: 'assistant',
        content: [toolUse],
      });

      messages.push({
        role: 'user',
        content: [
          {
            type: 'tool_result',
            content: toolResponse,
            tool_use_id: toolUse.id,
          },
        ],
      });
      return this.chat({ messages, systemPrompt, tools, handleToolUse });
    } catch (error) {
      console.error(`Error generating AI response: ${JSON.stringify(error)}`);
      return null;
    }
  }
}
