# Claude AI Tool Use Workshop

## Installation
Node version: 20 or above
```
npm install
```

Run the code with the below command for the instructions.
```
npm run start
```

## Prerequisites
1. Get the CLAUDE_API_KEY from the host
2. Create an `.env` file in the root directory and add the variable: `CLAUDE_API_KEY=<api_key>`


## Instructions
When you run the command, the tool will ask you to enter your input as "user message".

1. Open `main.ts` file. Uncomment the first function call (`generateResponseWithCurrentTimeTool`)
  - You will see that this has no system prompt, and we are asking for the current time. Let's see how Claude AI responds to our request.
2. Comment out the previous call and uncomment the next `generateResponseWithCurrentTimeTool` call with the system prompt.
  - See if the `userMessage` will change the AI response.
3. Comment previous function calls and uncomment the next `generateResponseWithCurrentTimeTool` with mocked response times.
  - Instead of providing the current time, we are basically mocking it as our hard coded responses. See if Claude will react to the tool use with mock time.
  - You can go ahead in `system-prompts.ts` file and update the prompt as you like.
    - You can try to add new prompts for AI to react to the time you provided. For example it can change how it greets you depending of the current time value you provided (Good morning vs Good night).
    - You can also write in the prompt to respond in your own language (Arabic/German/Hebrew/Polish).
  - [AFTER THE SESSION] you can modify the tools and add current weather tool and play around it.
4. Now we will be using a basic travel planner, but we are missing the tool configuration.
  - Go to `claude/tools/weather-forecast.ts` to update the missing tool definition. You can cheat from other tools.
    - You will have to make sure that the `input_schema structure is inline with `weatherService.getWeatherForecastByLocation` function.
  - Go to `tool-use/travel-planner.ts` file and fill in the body for the function `handleToolUse` for the tool use.
  - Go to `claude/claude.service.ts` and see the implementation of `chat` method.
    - See the recursion when responding to the Claude AI with tool use
    - See how messages are handled in the response back to the Claude
  - Add other implementations or update implementations if you like
  - Go to `system-prompts.ts` file and see the prompt for the travel-planner, and modify if necessary.
5. If everything is ready, then we can start using the travel-planner prompt.
  - Go back to `main.ts` file.
  - Comment the previous calls and uncomment `generateTravelPlannerResponse` call.
  - Update user message if you like.