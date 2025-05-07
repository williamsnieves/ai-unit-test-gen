# AI Unit Test Generator

A modern web application that generates unit tests using various AI models. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🤖 Multiple AI Model Support
  - GPT-4 (OpenAI)
  - Claude 3.5 Sonnet (Anthropic)
  - Qwen 2.5 Coder 32B (Alibaba)
  - CodeQwen 1.5 7B (Alibaba)
  - CodeLlama 70B (Meta)
  - DeepSeek Coder 33B (DeepSeek)

- 🧪 Test Framework Support
  - Jest
  - Vitest
  - Mocha

- ✨ Modern Features
  - Real-time streaming responses
  - Code validation
  - Responsive design
  - Dark mode support
  - Type-safe development

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **State Management**: React Hooks
- **Code Quality**: ESLint, Prettier
- **Package Manager**: npm

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── ...             # Feature-specific components
├── config/             # Configuration files
├── hooks/              # Custom React hooks
│   ├── useModelSelection.ts
│   ├── useFrameworkSelection.ts
│   ├── useCodeSelection.ts
│   └── useTestGeneration.ts
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-unit-test-gen.git
   cd ai-unit-test-gen
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- **Code Style**: The project uses ESLint and Prettier for code formatting. Run `npm run lint` to check for issues.
- **Type Checking**: TypeScript is used for type safety. Run `npm run type-check` to verify types.
- **Testing**: Run `npm test` to execute tests.

## Architecture

The application follows SOLID principles and is built with maintainability in mind:

- **Single Responsibility**: Each hook and component has a single, well-defined purpose
- **Open/Closed**: Components are open for extension but closed for modification
- **Interface Segregation**: Clean interfaces that expose only necessary functionality
- **Dependency Inversion**: Components depend on abstractions rather than concrete implementations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
