# AI Unit Test Generator

A modern web application that uses AI to generate unit tests for your code. Built with Next.js, TypeScript, and OpenAI's GPT-4.

## Features

- Generate unit tests using Jest or Vitest
- Clean, modern UI built with Shadcn UI and Tailwind CSS
- Real-time test generation using OpenAI's GPT-4
- Type-safe implementation with TypeScript

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Select your preferred test framework (Jest or Vitest)
2. Paste your code into the input area
3. Click "Generate Test" to create unit tests
4. Copy the generated test code and use it in your project

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- OpenAI API
- Tanstack Query
- Radix UI

## License

MIT
