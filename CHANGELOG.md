# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.0.0] - 2026-09-01

### Added
- Initialized tenx harness, conventions (`CON-001`), architecture documentation (`DOC-001`), and multi-agent hooks.
- Implemented comprehensive Promptcraft CLI engine (`engine/src/cli.ts`) supporting `photo`, `anime`, `edit`, `video`, `director`, `references`, `sync`, `catalog`, and `capabilities` actions.
- Embedded 16 preset catalogs (shots, lighting, cameras, lenses, movie looks, film stocks, anime styles) and 26 camera movements directly into standalone Bun builds (`engine/src/library-data.ts`).
- Added Bun build scripts (`bun run build:cli`) compiling standalone binary `./bin/promptcraft`.
- Added automated CLI test suite (`engine/src/cli.test.ts`) with 100% passing tests across 62 test cases.
