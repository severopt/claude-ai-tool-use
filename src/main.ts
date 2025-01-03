import 'dotenv/config';
import { generateResponseWithCurrentTimeTool } from './tool-use/current-time';
import { generateTravelPlannerResponse } from './tool-use/travel-planner';

import { CURRENT_TIME_SYSTEM_PROMPT } from './system-prompts';

const main = () => {
  console.log('Awaiting user input - press `ctrl + c` to exit:\n');

  // Step 1
  // uncomment either line before running npm run start
  // no system prompt
  // sample user message:
  // Can you tell me what time it is now?
  generateResponseWithCurrentTimeTool({
    systemPrompt: '',
    useTools: false,
  });

  // Step 2
  // sample system prompt, instructions with tool use, and a user message
  // Can you tell me what time it is now?
  // Can you tell me what time it is now for Berlin, Germany?
  // generateResponseWithCurrentTimeTool({
  //   systemPrompt: CURRENT_TIME_SYSTEM_PROMPT,
  //   useTools: true,
  // });

  // Step 3
  // mock response time to test the different responses:
  // mockTimeResponse: '2025-01-09T09:00:00GMT+1'
  // mockTimeResponse: '2025-01-09T13:00:00GMT+1'
  // mockTimeResponse: '2025-01-09T18:00:00GMT+1'
  // mockTimeResponse: '2025-01-09T23:00:00GMT+1'
  // generateResponseWithCurrentTimeTool({
  //   systemPrompt: CURRENT_TIME_SYSTEM_PROMPT,
  //   useTools: true,
  // });

  // Step 5
  // TODO: Change the message here if necessary.
  // you can add more details like
  // - when you're available,
  // - budget limits,
  // - whether you can travel out of Berlin etc.
  // example user message:
  // I am visiting Berlin for the next 3 days and I would like you to help me with a travel plan.
  // generateTravelPlannerResponse();
};

main();
