import 'dotenv/config';
import { generateResponseWithCurrentTimeTool } from './tool-use/current-time';
import { generateTravelPlannerResponse } from './tool-use/travel-planner';

import { CURRENT_TIME_SYSTEM_PROMPT } from './system-prompts';

const main = async () => {
  const now = performance.now();

  // Step 1
  // uncomment either line before running npm run start
  // no system prompt
  // await generateResponseWithCurrentTimeTool({
  //   systemPrompt: '',
  //   userMessage: 'Can you tell me what time it is now?',
  //   useTools: false,
  // });

  // Step 2
  // sample system prompt, instructions with tool use, and a user message
  // await generateResponseWithCurrentTimeTool({
  //   systemPrompt: CURRENT_TIME_SYSTEM_PROMPT,
  //   // userMessage: 'Can you tell me what time it is now?',
  //   userMessage: 'Can you tell me what time it is now for Berlin, Germany?',
  //   useTools: true,
  // });

  // Step 3
  // mock response time to test the different responses
  // await generateResponseWithCurrentTimeTool({
  //   systemPrompt: CURRENT_TIME_SYSTEM_PROMPT,
  //   // userMessage: 'Can you tell me what time it is now?',
  //   userMessage: 'Can you tell me what time it is now for Berlin, Germany?',
  //   useTools: true,
  //   mockTimeResponse: '2025-01-09T09:00:00GMT+1'
  //   // mockTimeResponse: '2025-01-09T13:00:00GMT+1'
  //   // mockTimeResponse: '2025-01-09T18:00:00GMT+1'
  //   // mockTimeResponse: '2025-01-09T23:00:00GMT+1'
  // });

  // Step 5
  // TODO: Change the message here if necessary.
  // you can add more details like
  // - when you're available,
  // - budget limits,
  // - whether you can travel out of Berlin etc.
  // const userMessage =
  //   'I am visiting Berlin for the next 3 days and I would like you to help me with a travel plan.';
  // await generateTravelPlannerResponse(userMessage);

  console.log(
    `\nScript took ${((performance.now() - now) / 1000).toFixed(2)}s to run`
  );
};

main();
