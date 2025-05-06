# AI Unit Test Generator

A modern web application that uses AI to generate unit tests for your code. Built with Next.js, TypeScript, and multiple AI models (OpenAI's GPT-4 and Anthropic's Claude 3 Sonnet).

## Features

- Generate unit tests using Jest or Vitest
- Choose between multiple AI models (GPT-4 and Claude 3 Sonnet)
- Clean, modern UI built with Shadcn UI and Tailwind CSS
- Real-time test generation using AI
- Type-safe implementation with TypeScript

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Select your preferred AI model (GPT-4 or Claude 3 Sonnet)
2. Select your preferred test framework (Jest or Vitest)
3. Paste your code into the input area
4. Click "Generate Test" to create unit tests
5. Copy the generated test code and use it in your project

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- OpenAI API
- Anthropic API
- Tanstack Query
- Radix UI

## License

MIT
