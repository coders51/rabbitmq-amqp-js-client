# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a RabbitMQ AMQP 1.0 JavaScript/TypeScript client library that works with RabbitMQ 4.x. It's built on top of the Rhea AMQP 1.0 library and provides a higher-level abstraction for AMQP operations.

## Build System & Commands

### Primary Commands
- `npm run build` - Build the library for all formats (CJS, ESM, UMD) using TypeScript and Rollup
- `npm run build:browser` - Build browser-specific bundle using Vite (outputs to dist_browser/)
- `npm test` - Run test suite using Vitest
- `npm run check` - Run all quality checks (TypeScript, ESLint, Prettier, spell check)

### Quality Assurance Commands
- `npm run check-ts` - TypeScript type checking without emitting files
- `npm run check-lint` - Run ESLint on source and test files
- `npm run check-format` - Check Prettier formatting
- `npm run check-spell` - Run spell check on TypeScript files
- `npm run format` - Format code with Prettier

### Testing
- Tests are organized into unit tests (`test/unit/`) and e2e tests (`test/e2e/`)
- Test setup in `test/setup.ts`
- Uses Vitest as the test runner

## Architecture

### Core Components

#### Environment & Connection Pattern
The library follows a hierarchical structure:
1. **Environment** (`src/environment.ts`) - Top-level factory for connections
2. **Connection** (`src/connection.ts`) - Manages publishers, consumers, and topology
3. **Management** (`src/management.ts`) - AMQP-based topology management (queues, exchanges, bindings)

#### Key Classes
- `AmqpEnvironment` - Main entry point, creates connections
- `AmqpConnection` - Wraps Rhea connection, manages publishers/consumers
- `AmqpManagement` - Handles queue/exchange/binding operations via AMQP management interface
- `AmqpPublisher` (`src/publisher.ts`) - Message publishing functionality
- `AmqpConsumer` (`src/consumer.ts`) - Message consumption functionality

#### Multi-Platform Support
- Node.js entry: `src/index.ts` - Standard exports
- Browser entry: `src/index_browser.ts` - Exports with global assignments for browser compatibility
- Build outputs: CJS (`dist/cjs/`), ESM (`dist/esm/`), UMD (`dist/umd/`), Browser (`dist_browser/`)

### Message & Link Management
- `src/message.ts` - Message creation and handling
- `src/link_message_builder.ts` - AMQP management message construction
- `src/response_decoder.ts` - Decode management operation responses
- `src/delivery_context.ts` - Message delivery context handling

### Utilities
- `src/utils.ts` - Common utilities and AMQP outcome states
- `src/types.d.ts` - TypeScript type definitions

## Development Notes

### Dependencies
- **rhea** - Core AMQP 1.0 implementation (GitHub version from amqp/rhea)
- Built for Node.js with browser compatibility via polyfills
- Uses Vite for browser builds, Rollup for Node.js builds

### TypeScript Configuration
- Extends `@tsconfig/node22`
- Strict type checking enabled
- Source maps enabled for debugging

### WebSocket Support
The library supports WebSocket connections for browser environments via the `webSocket` and `webSocketUrl` parameters in `EnvironmentParams`.

### Roadmap Items to Consider
According to the README, the project is working toward:
1. AMQP-based management functions
2. Connection management improvements
3. Environment abstraction completion
4. Simple publishing/consuming APIs
5. Auto-reconnect functionality
6. Prometheus metrics (optional)

Keep these goals in mind when making changes or additions to the codebase.