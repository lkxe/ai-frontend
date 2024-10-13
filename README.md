# Simple AI API Frontend

This project is a simple AI frontend application for multiple AI providers (currently only Claude/Anthropic API is working), built using Wails. It provides a user-friendly interface to interact with Claude, an AI assistant created by Anthropic.

## Features
- Simple and intuitive user interface
- Real-time communication with the Claude API
- Cross-platform support (Windows, macOS, Linux)

## Prerequisites
Before you begin, ensure you have the following installed
- Go (Version 1.23 or later)
- Bun or any other Node Runtime
- Wails

You'll also need an API key from Anthropic to use the Claude API which can be obtained [here](https://console.anthropic.com/).

## Installation

1. Clone this repository
```shell
git clone https://github.com/xlukas1337/ai-frontend.git
cd ai-frontend
```

2. Install dependencies:
```shell
cd frontend/src
bun install
```

3. Set up your Claude API key
- Rename the .env.example file to .env
- Open the .env file and insert your API keys:
```
ANTHROPIC_API_KEY=YOUR_API_KEY
```

## Development
- The frontend is built with React and is located in the src/frontend directory.
- The backend is written in Go and is in the main.go file.
- To make changes, edit the relevant files and use wails dev to run the app in development mode.

## Building for production

To build the application for production, run the matching script for your platform in the scripts directory

## License

This project is licensed under the MIT License - see the LICENSE file for details.


