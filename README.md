<div align="center">
  <img src="md/logo.png" width="120" height="120" />
  <br />
  <br />

  <img src="https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="discord.js v14">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js 18+">

  <br />
</div>

---


<p align="center">

</p>

# 🤖 Kintaro Discord Bots

A multi-bot Discord management system built with **discord.js v14**. This project hosts **11 independent Discord bots** with a shared codebase architecture, centralized management scripts, and a powerful feature-rich main bot called **Kintaro**.

## 📑 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Standard Bots](#standard-bots-10-bots)
- [Kintaro Bot — The Main Bot](#kintaro-bot--the-main-bot)
  - [Slash Commands](#slash-commands)
  - [Event-Driven Features](#event-driven-features)
  - [Access Control & Security](#access-control--security)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Deploying Commands](#deploying-commands)
  - [Running the Bots](#running-the-bots)
- [Project Scripts](#project-scripts)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)

---

## 🌐 Overview

**Kintaro Discord Bots** is a monorepo-style project designed to run multiple Discord bots simultaneously from a single machine. It contains **10 standard companion bots** that share the same lightweight architecture, and **1 advanced main bot (Kintaro)** packed with moderation tools, server management features, fun commands, and automated event handlers.

All bots are built using **discord.js v14**, follow a modular command/event handler pattern, and are configured via individual `.env` files for maximum flexibility.

### Key Highlights

- 🏗️ **Modular Architecture** — Commands and events are loaded dynamically from dedicated folders
- 🔧 **Centralized Management** — Install dependencies, deploy commands, run, and clear all bots with a single script
- 🛡️ **Server Guard System** — Welcome/farewell messages with invite tracking and admin-based member verification
- 🎭 **Role Picker** — Interactive button-based role assignment with single-role and multi-role modes
- 🔒 **Access Control** — Per-bot public/private mode with automatic unauthorized server removal
- 🎙️ **Voice Channel Integration** — Manual and automatic voice channel joining capabilities

---

## 🏗️ Architecture

The project follows a flat monorepo structure where each bot lives in its own subfolder under `all/`. A set of root-level management scripts orchestrate operations across all bots simultaneously.

```
kintaro-discord-bots/
├── all/                        # All bot instances
│   ├── atakan/                 # Standard bot
│   ├── caylak/                 # Standard bot
│   ├── durden/                 # Standard bot
│   ├── flawes/                 # Standard bot
│   ├── kintaro/                # ⭐ Main bot (feature-rich)
│   ├── leywin/                 # Standard bot
│   ├── luxury/                 # Standard bot
│   ├── micsfo/                 # Standard bot
│   ├── mistazt/                # Standard bot
│   ├── starx/                  # Standard bot
│   └── truvaq/                 # Standard bot
├── run.js                      # Start all bots
├── run.bat                     # Windows shortcut — start all bots
├── deploy.js                   # Deploy slash commands for all bots
├── deploy.bat                  # Windows shortcut — deploy commands
├── install-requirements.js     # Install npm packages for all bots
├── install-requirements.bat    # Windows shortcut — install deps
├── clear.js                    # Clear slash commands for all bots
└── clear.bat                   # Windows shortcut — clear commands
```

Each individual bot folder contains:

```
bot-name/
├── .env                # Bot token, guild ID, and feature flags
├── index.js            # Main entry point
├── deploy.js           # Slash command deployment script
├── clear.js            # Slash command removal script
├── package.json        # Dependencies
├── commands/           # Slash command modules
│   └── *.js
└── events/             # Event handler modules
    └── *.js
```

---

## 🤝 Standard Bots (10 Bots)

The following **10 bots** share an identical, lightweight architecture. They are designed to act as presence/companion bots with minimal features:

| # | Bot Name    | Description |
|---|-------------|-------------|
| 1 | **atakan**  | Standard companion bot |
| 2 | **caylak**  | Standard companion bot |
| 3 | **durden**  | Standard companion bot |
| 4 | **flawes**  | Standard companion bot |
| 5 | **leywin**  | Standard companion bot |
| 6 | **luxury**  | Standard companion bot |
| 7 | **micsfo**  | Standard companion bot |
| 8 | **mistazt** | Standard companion bot |
| 9 | **starx**   | Standard companion bot |
| 10 | **truvaq** | Standard companion bot |

### Standard Bot Features

Each standard bot includes the following capabilities:

- **`/ping` Command** — A simple health-check that replies with "Pong!"
- **Auto Voice Join** — Automatically joins a specified voice channel at configurable intervals (togglable via `KINTARO_JUMP_VOICE_AUTO`)
- **Public/Private Mode** — Can be configured to either accept all servers or restrict to a single authorized server
- **Unauthorized Server Protection** — If `KINTARO_BOT_PUBLIC` is `false`, the bot will send a notice and automatically leave any unauthorized servers
- **Startup Cleanup** — On startup, if `KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS` is enabled, the bot leaves all servers except the authorized one
- **Member Caching** — Automatically fetches and caches all members on startup for authorized servers
- **Dynamic Event Loading** — Events are loaded from the `events/` folder based on feature flags

### Standard Bot Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DISCORD_TOKEN` | Bot authentication token | — |
| `CLIENT_ID` | Bot application client ID | — |
| `GUILD_ID` | Authorized guild (server) ID | — |
| `KINTARO_BOT_PUBLIC` | Allow bot on any server | `false` |
| `KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS` | Leave unauthorized servers on startup | `true` |
| `KINTARO_JUMP_VOICE_AUTO` | Enable auto voice channel join | `true` |
| `KINTARO_JUMP_VOICE_AUTO_JOIN_INTERVAL` | Join check interval in seconds | `300` |
| `KINTARO_JUMP_VOICE_AUTO_CHANNEL_ID` | Target voice channel ID | — |

---

## ⭐ Kintaro Bot — The Main Bot

**Kintaro** is the flagship bot of this project. It extends the standard bot template with a comprehensive suite of **12 slash commands** and **5 event-driven features**, making it a full-featured Discord server management and entertainment bot.

### 🎮 Slash Commands

#### `/ping`
> **Permission:** Everyone

A simple latency check command. Replies with "Pong!" to confirm the bot is online and responsive.

---

#### `/avatar`
> **Permission:** Everyone

Displays a user's avatar in full resolution (1024×1024).

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `user` | User | ✅ | The user whose avatar you want to view |

**Features:**
- Supports animated avatars (GIFs)
- Displays in a rich embed with a DodgerBlue color accent
- Shows who requested the avatar in the footer

---

#### `/banner`
> **Permission:** Everyone

Displays a user's profile banner in full resolution.

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `user` | User | ✅ | The user whose banner you want to view |

**Features:**
- Fetches the user profile with `force: true` to guarantee up-to-date data
- Supports animated banners
- Gracefully handles users who don't have a banner set

---

#### `/profile`
> **Permission:** Everyone

Shows a detailed profile card for a user with comprehensive server-specific information.

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `user` | User | ❌ | Target user (defaults to the command author) |

**Displayed Information:**
- 👤 Username
- 📅 Account creation date
- 📅 Server join date
- ⚙️ Account type (Bot / Trusted)
- 🔵 Online/Offline status
- 🚀 Nitro Boost status & date
- 🔊 Current voice channel (if any)
- 📜 All assigned roles (sorted alphabetically)

---

#### `/serverstats`
> **Permission:** Everyone

Displays a comprehensive overview of the current server's statistics in a rich embed.

**Displayed Information:**
- 👑 Server owner
- 📅 Server creation date
- 👥 Total member count
- 🤖 Bot count
- 📚 Total channel count (excluding categories)
- 📝 Text channel count
- 🔊 Voice channel count
- 🔖 Role count
- 🔧 Admin count
- 📜 Full list of all roles (sorted alphabetically)
- 🔧 Full list of all admin users (sorted alphabetically)

---

#### `/botstats`
> **Permission:** Everyone

Shows information about the Kintaro bot itself.

**Displayed Information:**
- ⏳ Uptime (hours, minutes, seconds)
- 👨‍💻 Bot creator
- Bot bio/description

---

#### `/clear`
> **Permission:** Manage Messages

Bulk-deletes a specified number of messages from the current channel.

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `amount` | Integer | ✅ | Number of messages to delete (1–100) |

**Features:**
- Uses Discord's bulk delete API for efficient deletion
- Automatically skips messages older than 14 days (Discord API limitation)
- Permission check to ensure only authorized users can delete messages

---

#### `/say`
> **Permission:** Administrator

Sends a custom message to a specified text channel as the bot.

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `kanal` | Channel | ✅ | Target text channel |
| `mesaj` | String | ✅ | Message content to send |

**Features:**
- Supports multi-line messages using `\n` escape sequences
- Ephemeral confirmation reply (only visible to the command author)
- Channel type validation to ensure only text channels are selected

---

#### `/copymessage`
> **Permission:** Administrator

Copies a message from one channel to another, preserving content and embeds.

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `hedef_kanal` | Channel | ✅ | Destination channel |
| `kaynak_kanal` | Channel | ✅ | Source channel |
| `mesaj_id` | String | ✅ | Message ID to copy |

**Features:**
- Preserves both text content and embedded content
- Error handling for deleted or invalid message IDs
- Ephemeral responses for all feedback

---

#### `/rolepicker`
> **Permission:** Administrator

Creates an interactive role picker message with buttons that users can click to assign/remove roles.

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `kanal` | Channel | ✅ | Channel to post the role picker |
| `mod` | Choice | ✅ | `tek_rol` (single) or `coklu_rol` (multiple) |
| `roller` | String | ✅ | Role mentions (e.g., `@Role1 @Role2 @Role3`) |
| `mesaj` | String | ✅ | Description message above the buttons |

**Features:**
- **Single-Role Mode (`tek_rol`)** — Only one role from the picker can be active at a time. Selecting a new role automatically removes the previous one
- **Multi-Role Mode (`coklu_rol`)** — Users can toggle multiple roles on/off independently
- Automatically creates role buttons arranged in rows (max 5 per row)
- Includes a "Remove All Roles" danger button for quick reset
- Button interactions have a 1-second cooldown to prevent spam
- Multi-line support in the description message using `\n`

---

#### `/jumpvoice`
> **Permission:** Administrator

Makes the bot join the voice channel that the command author is currently in.

**Features:**
- Uses `@discordjs/voice` for stable voice connections
- Validates that the user is in a voice channel before attempting to join

---

#### `/ship`
> **Permission:** Everyone

A fun command that generates a compatibility percentage between the command author and a selected user, accompanied by a custom-generated image.

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `user` | User | ✅ | The user to ship with |

**Features:**
- Generates a random compatibility percentage (0–100%)
- Creates a custom canvas image featuring:
  - Blurred background image
  - Both users' avatars rendered as circles with black borders
  - A heart emoji (❤️) between the avatars
  - The compatibility percentage displayed below the heart
- Uses **Sharp** for image preprocessing and format conversion
- Uses **Canvas** for dynamic image generation
- Handles WebP avatar format conversion for compatibility

---

### 🎯 Event-Driven Features

Kintaro includes several powerful event-driven systems that can be individually toggled via environment variables.

#### 1. Entry/Exit Messages (`kintaroEntryExit`)
> **Toggle:** `KINTARO_ENTRY_EXIT=true`

Simple welcome and farewell messages posted to a designated channel when members join or leave the server.

- **Join:** Posts a welcome message with the member's tag, mention, and current member count
- **Leave:** Posts a farewell message with the member mention and updated member count
- Requires `KINTARO_ENTRY_EXIT_WELCOME_CHANNEL` to be set

---

#### 2. Guard System (`kintaroEntryExitGuard`)
> **Toggle:** `KINTARO_ENTRY_EXIT_GUARD=true`

An advanced member verification system that requires admin approval before new members gain full server access.

**How it works:**
1. When a new member joins, they are automatically assigned an **Unverified** role
2. A welcome message is posted in the guard channel with:
   - The new member's tag and mention
   - Current server member count
   - Invite tracking info (who invited them and which invite code was used)
   - A **"Register"** button for admins
3. An admin clicks the **Register** button to:
   - Remove the **Unverified** role
   - Assign the **Verified** role
   - Update the welcome message to show who registered the member
   - Disable the button (changes to "Registered" with green style)
4. If the member leaves before being registered:
   - The welcome message is updated with a notice
   - The button is disabled and changes to "User Left the Server" with red style
   - A farewell message with a GIF is sent

**Invite Tracking:**
- Primary method: Checks server invites to identify the inviter and invite code
- Fallback: Checks audit logs for `MemberAdd` events
- Last resort: Displays "joined via custom link or direct entry"

---

#### 3. Auto Voice Join (`kintaroJumpVoiceAuto`)
> **Toggle:** `KINTARO_JUMP_VOICE_AUTO=true`

Automatically joins a specified voice channel at regular intervals to maintain presence.

- Checks if the bot is already in the target channel to avoid redundant joins
- Configurable interval via `KINTARO_JUMP_VOICE_AUTO_JOIN_INTERVAL` (in seconds)
- Uses `@discordjs/voice` with proper guild adapter configuration

---

#### 4. Auto Responder (`kintaroAutoResponder`)
> **Toggle:** `KINTARO_AUTO_RESPONSER=true`

Automatically responds to specific messages with predefined replies. Acts as a fun interaction system for community members.

- Responds to greetings and specific user mentions
- Content-based matching with customizable responses
- Ignores messages from other bots

---

### 🔒 Access Control & Security

Kintaro has a built-in security system with two tiers:

| Feature | Description |
|---------|-------------|
| **Public Mode** (`KINTARO_BOT_PUBLIC=true`) | The bot can be added to any server. Sends a greeting message upon joining a new server. |
| **Private Mode** (`KINTARO_BOT_PUBLIC=false`) | The bot only operates in the authorized server (`GUILD_ID`). If added to any other server, it sends a notice and automatically leaves. |
| **Startup Cleanup** (`KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS=true`) | On startup, the bot checks all servers it's currently in and leaves any that don't match the authorized `GUILD_ID`. |

---

## 🔑 Environment Variables

### Kintaro Bot Full Configuration

```env
# ─── Core Authentication ───
DISCORD_TOKEN=                              # Bot token from Discord Developer Portal
CLIENT_ID=                                  # Bot application's client ID
GUILD_ID=                                   # Authorized server ID

# ─── Access Control ───
KINTARO_BOT_PUBLIC=false                    # Allow bot on any server (true/false)
KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS=true # Leave unauthorized servers on startup

# ─── Entry/Exit Messages ───
KINTARO_ENTRY_EXIT=true                     # Enable simple join/leave messages
KINTARO_ENTRY_EXIT_WELCOME_CHANNEL=         # Channel ID for join/leave messages

# ─── Guard System ───
KINTARO_ENTRY_EXIT_GUARD=true               # Enable the verification guard system
KINTARO_ENTRY_EXIT_GUARD_WELCOME_CHANNEL=   # Channel ID for guard welcome messages
KINTARO_ENTRY_EXIT_GUARD_UNVERIFIED_ROLE=   # Role ID assigned to unverified members
KINTARO_ENTRY_EXIT_GUARD_VERIFIED_ROLE=     # Role ID assigned after admin verification

# ─── Auto Voice Join ───
KINTARO_JUMP_VOICE_AUTO=true                # Enable automatic voice channel joining
KINTARO_JUMP_VOICE_AUTO_JOIN_INTERVAL=300   # Check interval in seconds (default: 300)
KINTARO_JUMP_VOICE_AUTO_CHANNEL_ID=         # Target voice channel ID

# ─── Auto Responder ───
KINTARO_AUTO_RESPONSER=true                 # Enable automatic message responses
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** (included with Node.js)
- A Discord account and at least one [Discord Application](https://discord.com/developers/applications) with a bot token
- The bot must be invited to your server with the following permissions:
  - `Send Messages`
  - `Manage Messages`
  - `Manage Roles`
  - `View Channels`
  - `Connect` & `Speak` (for voice features)
  - `Read Message History`
  - `Use Slash Commands`

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/kintaro-discord-bots.git
cd kintaro-discord-bots
```

2. **Install dependencies for all bots at once:**

```bash
# Using the script
node install-requirements.js

# Or on Windows
install-requirements.bat
```

This will run `npm install` in every bot folder under `all/`.

### Configuration

1. Navigate to each bot's folder under `all/`
2. Edit the `.env` file and fill in your bot's credentials:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_server_id_here
```

3. For the **Kintaro** bot, additionally configure the feature-specific variables (channels, roles, etc.)

### Deploying Commands

Before using slash commands, you need to register them with Discord:

```bash
# Deploy commands for all bots
node deploy.js

# Or on Windows
deploy.bat
```

This runs `node deploy.js` inside each bot folder, registering all slash commands as **guild-specific commands** for faster propagation.

### Running the Bots

```bash
# Start all bots simultaneously
node run.js

# Or on Windows
run.bat
```

Each bot runs as a separate child process. Console output is prefixed with the bot folder name for easy identification.

---

## 📜 Project Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **install-requirements** | `node install-requirements.js` | Runs `npm install` in every bot folder |
| **deploy** | `node deploy.js` | Deploys slash commands for all bots to their respective guilds |
| **run** | `node run.js` | Starts all bots simultaneously as child processes |
| **clear** | `node clear.js` | Removes all registered slash commands for all bots |

Each script also has a `.bat` equivalent for easy execution on Windows via double-click.

> **Note:** Each bot also has its own `deploy.js` and `clear.js` that can be run individually for granular control.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [discord.js v14](https://discord.js.org/) | Core Discord API wrapper |
| [@discordjs/voice](https://www.npmjs.com/package/@discordjs/voice) | Voice channel management |
| [canvas](https://www.npmjs.com/package/canvas) | Dynamic image generation (ship command) |
| [sharp](https://www.npmjs.com/package/sharp) | Image processing & format conversion |
| [axios](https://www.npmjs.com/package/axios) | HTTP requests for avatar fetching |
| [dotenv](https://www.npmjs.com/package/dotenv) | Environment variable management |
| [ffmpeg-static](https://www.npmjs.com/package/ffmpeg-static) | FFmpeg binary for audio/voice support |

---

## 📂 Project Structure

```
kintaro-discord-bots/
│
├── 📁 all/
│   ├── 📁 atakan/           # Standard bot
│   ├── 📁 caylak/           # Standard bot
│   ├── 📁 durden/           # Standard bot
│   ├── 📁 flawes/           # Standard bot
│   ├── 📁 kintaro/          # ⭐ Main bot
│   │   ├── 📁 assets/
│   │   │   └── bg.jpeg          # Background image for /ship command
│   │   ├── 📁 commands/
│   │   │   ├── kintaroAvatar.js
│   │   │   ├── kintaroBanner.js
│   │   │   ├── kintaroBotStats.js
│   │   │   ├── kintaroClear.js
│   │   │   ├── kintaroCopyMessage.js
│   │   │   ├── kintaroJumpVoice.js
│   │   │   ├── kintaroPing.js
│   │   │   ├── kintaroProfile.js
│   │   │   ├── kintaroRolePicker.js
│   │   │   ├── kintaroSay.js
│   │   │   ├── kintaroServerStats.js
│   │   │   └── kintaroShip.js
│   │   ├── 📁 events/
│   │   │   ├── kintaroAutoResponder.js
│   │   │   ├── kintaroEntryExit.js
│   │   │   ├── kintaroEntryExitGuard.js
│   │   │   ├── kintaroJumpVoiceAuto.js
│   │   │   └── ready.js
│   │   ├── .env
│   │   ├── clear.js
│   │   ├── clear-global.js
│   │   ├── deploy.js
│   │   ├── index.js
│   │   └── package.json
│   ├── 📁 leywin/           # Standard bot
│   ├── 📁 luxury/           # Standard bot
│   ├── 📁 micsfo/           # Standard bot
│   ├── 📁 mistazt/          # Standard bot
│   ├── 📁 starx/            # Standard bot
│   └── 📁 truvaq/           # Standard bot
│
├── clear.bat
├── clear.js
├── deploy.bat
├── deploy.js
├── install-requirements.bat
├── install-requirements.js
├── run.bat
├── run.js
└── README.md
```

---

<p align="center">
  ❤️ Developed By Kintaro</a>
</p>
