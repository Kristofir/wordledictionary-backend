# Wordle Dictionary Backend

This is an open source rebuild of the backend for Wordle Dictionary.

## Table of Contents
[Installation](#installation)

## Installation

Make sure [Bun is installed](https://github.com/oven-sh/bun).

Then install packages.
```
bun install
```

Then set up the application's word data. It's static, so this only needs to be done once.
```
bun run compilewords
```

## Usage

To start the server, run
```
bun run start
```
(This will definitely change soon.)

It will run on port `3000` by default.