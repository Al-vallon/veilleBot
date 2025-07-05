# VeilleBot

**VeilleBot** is an automated Discord bot designed for technology monitoring and RSS feed aggregation. The bot continuously monitors multiple RSS feeds, filters content based on specified keywords, and automatically posts relevant technology news to designated Discord channels.

## Project Overview

This Discord bot serves as an intelligent news aggregator that helps development teams and technology enthusiasts stay updated with the latest industry news. It fetches content from various RSS feeds, applies keyword filtering to ensure relevance, and delivers curated technology updates directly to Discord channels.

The bot is built with Node.js and Discord.js, featuring automatic deployment through GitHub Actions, Docker containerization for easy deployment, and comprehensive error handling for reliable operation.

## Core Features

**Automated RSS Monitoring**: Continuously checks configured RSS feeds for new content and processes updates every hour.

**Intelligent Filtering**: Uses keyword matching to filter content, ensuring only relevant technology news reaches your Discord channels.

**Discord Integration**: Seamlessly integrates with Discord servers, posting formatted news updates with embedded links and descriptions.

**Persistent State Management**: Tracks previously posted articles to avoid duplicates and maintains startup date configuration for filtering recent content.

**Slash Commands**: Provides interactive commands for manual news checking, statistics viewing, and bot management.

**Production Ready**: Includes comprehensive CI/CD pipeline, Docker support, and automated deployment to various hosting platforms.

## Getting Started

**Prerequisites**: Ensure you have Node.js (version 16 or higher), a Discord Bot Token, and a Discord Server where you have administrator permissions.

**Installation**: Clone this repository to your local machine and navigate to the project directory. Install the required dependencies by running `npm install` in the project root.

**Configuration**: Copy the `.env.example` file to `.env` and configure your environment variables. Set your `DISCORD_TOKEN` with your bot's token, `DISCORD_CHANNEL_ID` with the target channel ID, and optionally `DISCORD_CLIENT_ID` and `DISCORD_GUILD_ID` for command deployment.

**RSS Feed Setup**: Edit the `feeds.json` file to configure your desired RSS feeds. Each feed entry should include a name, URL, category, and relevant keywords for filtering content.

**Command Deployment**: Deploy the bot's slash commands to Discord by running `node scripts/deploy-commands.js`. This step is required before the bot can respond to slash commands.

**Starting the Bot**: Launch the bot by running `npm start` or `node bot.js`. The bot will connect to Discord and begin monitoring configured RSS feeds.

## Running the Project

**Local Development**: After completing the installation and configuration steps, start the bot locally by running `node bot.js` in the project directory. The bot will display connection status and begin monitoring RSS feeds immediately. Check the console output for any configuration errors or successful startup messages.

**Using Docker**: Build the Docker image using `docker build -t veillebot .` and run it with `docker run -d --env-file .env veillebot`. Alternatively, use the provided docker-compose files for easier management with `docker-compose up -d` for development or `docker-compose -f docker-compose.prod.yml up -d` for production deployment.

**Production Deployment**: The project supports automatic deployment to Render, Railway, or any Docker-compatible hosting platform. Configure the required environment variables in your hosting platform's dashboard and connect your GitHub repository for automatic deployments when you push to the main branch.

**Monitoring and Logs**: Once running, the bot will log all activities to the console including RSS feed checks, article filtering, and Discord message posting. Monitor these logs to ensure proper operation and troubleshoot any issues that may arise.

**Verification**: Test the bot functionality by using the `/veille` slash command in your Discord server. This will trigger a manual news check and confirm that the bot is properly configured and operational.

## Configuration Files

The `config.json` file contains basic bot configuration including fallback values for Discord tokens and channel IDs. The `feeds.json` file defines all RSS feeds to monitor, with each entry specifying the feed URL, display name, category, and filtering keywords.

Environment variables take precedence over configuration files, making it easy to deploy across different environments while keeping sensitive information secure.

## Commands

The bot provides several slash commands for interaction. Use `/veille` to manually trigger news checking and display recent articles. The `/stats` command shows bot statistics including uptime, monitored feeds, and operational status. Use `/reset-date` to reset the bot's startup date, which determines which articles are considered "new" for filtering purposes.

## Development and Deployment

The project includes a complete CI/CD pipeline using GitHub Actions. Code quality checks run automatically on every push, ensuring code syntax validation and dependency verification. Docker images are automatically built and published to Docker Hub when changes are pushed to the main branch.

For local development, use the provided scripts in the `scripts/` directory. Run `bash scripts/test-ci.sh` to perform local quality checks before pushing code. Use `bash scripts/setup-tokens.sh` for interactive configuration of deployment secrets.

The bot can be deployed to various platforms including Render, Railway, or any Docker-compatible hosting service. All necessary configuration files for different deployment methods are included in the project.

## Project Structure

The source code is organized into logical modules within the `src/` directory. The `newsManager.js` handles RSS feed processing and article filtering. Discord client management is handled by `discordClient.js`, while `commandHandler.js` manages slash command registration and execution.

All utility scripts are centralized in the `scripts/` directory, including deployment helpers, testing tools, and configuration utilities. Comprehensive documentation is available in the `docs/` directory covering CI/CD setup, token management, and deployment procedures.

## Contributing

This project follows standard Node.js development practices with automated testing and quality checks. Before submitting changes, run the local test suite to ensure code quality and compatibility. All commits should pass the automated CI/CD pipeline before being merged.

## License

This project is open source and available for modification and distribution according to standard open source practices.