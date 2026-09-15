# Contributing to Promptcraft

Thank you for your interest in contributing to Promptcraft! Promptcraft is an enterprise-grade, deterministic prompt assembly engine and standalone CLI designed for AI coding agents and generative media workflows.

## Development Workflow

### Prerequisites
- [Bun](https://bun.sh) (v1.1+)
- Git

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/sivakoneti/promptcraft.git
cd promptcraft

# Install dependencies
bun install
```

### Running Tests
```bash
# Run full test suite
bun test
```

### Building the Standalone CLI Binary
```bash
# Compile standalone binary with Bun
bun run build:cli

# Test the compiled binary
./bin/promptcraft capabilities
```

## Guidelines for Changes

1. **Pure Engine Logic**: Core prompt logic in `engine/src/` must remain pure functions without DOM or filesystem dependencies.
2. **Determinism**: Prompt generation must always produce byte-exact repeatable outputs for matching inputs.
3. **Agent First**: New features or actions should expose structured JSON schemas through the `capabilities` endpoint and support both flag-based and stdin-based IPC.
4. **Tenx Harness**: Follow Tenx SDLC processes (`tenx validate`, `tenx log`).
