<a href="README.md">
  <img src="https://img.shields.io/badge/Language-English-blue?style=flat-square&logo=google-translate&logoColor=white" alt="English">
</a>
<a href="README-TR.md">
  <img src="https://img.shields.io/badge/Dil-Türkçe-red?style=flat-square&logo=google-translate&logoColor=white" alt="Türkçe">
</a>

  <br />
  <br />

<div align="center">
  <img src="md/logo.png" width="120" height="120" />
  <br />
  <br />

  <p>
    Powerful Discord management bots featuring premium security and interactive tools.
  </p>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Discord.js](https://img.shields.io/badge/discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

  <p>
    <a href="#architectural">Architecture</a> •
    <a href="#security">Security</a> •
    <a href="#standart-bots">Standard Bots</a> •
    <a href="#main-bot">Main Bot</a> •
    <a href="#environment-variables">Configuration</a> •
    <a href="#installation">Installation</a> •
    <a href="#license">License</a>
  </p>

  <br />
  <br />
</div>

## 📋 About

**Kintaro Discord Bots** is a project built in a monorepo structure designed to run multiple Discord bots simultaneously on a single machine. The project contains a total of **11 Discord bots** developed using **discord.js v14**.

Among these bots, the main, advanced, and comprehensive one is the **Kintaro** bot. It has many features such as moderation systems, server management tools, fun commands, and automatic event handlers.

The other **10 standard bots** are simple bots generally developed to stay AFK in specific servers and voice channels. You can add or delete new bots as you wish.

All bots follow a modular command/event handler structure, and each is configured with independent `.env` files.

**Note**: In this document, bots other than the Kintaro bot will be referred to as "_Standard Bots_".

## ❓ What You Need to Know <a id="what-you-need-to-know"></a>

- There is a `.env` file in the root directory of each bot. This file must be configured correctly (bot token, guild ID, etc.).
- The `install-requirements.js` file in the root directory of the project allows installing all dependencies for all bots at once.
- The `deploy.js` file in the root directory of the project deploys all slash commands for all bots at once.
- The `clear.js` file in the root directory of the project clears all slash commands for all bots at once.
- The `run.js` file in the root directory of the project starts all bots simultaneously as child processes.

For detailed control, each bot's individual `deploy.js` and `clear.js` files can also be run one by one.

## 🏗️ Architecture <a id="architectural"></a>

Each bot follows a flat monorepo structure, living in its own folder inside the `all/` directory.

```
kintaro-discord-bots/
├── all/
│   ├── atakan/                 # Standard bot
│   ├── caylak/                 # Standard bot
│   ├── durden/                 # Standard bot
│   ├── flawes/                 # Standard bot
│   ├── kintaro/                # ⭐ Main bot
│   ├── leywin/                 # Standard bot
│   ├── luxury/                 # Standard bot
│   ├── micsfo/                 # Standard bot
│   ├── mistazt/                # Standard bot
│   ├── starx/                  # Standard bot
│   └── truvaq/                 # Standard bot
├── run.js                      # Starts all bots
├── run.bat                     
├── deploy.js                   # Deploys slash commands for all bots
├── deploy.bat                  
├── install-requirements.js     # Installs npm packages for all bots
├── install-requirements.bat    
├── clear.js                    # Clears slash commands for all bots
└── clear.bat                   
```

Each bot folder contains:

```
bot-name/
├── .env                # Bot token, server ID, and feature configurations
├── index.js            # Main entry point
├── deploy.js           # Slash command deployment
├── clear.js            # Slash command clearing
├── package.json        # Dependencies
├── commands/
│   └── *.js
└── events/
    └── *.js
```

## 🔒 Access Control and Security <a id="security"></a>

All bots have a built-in two-layer security system. Preferences are managed from each bot's own `.env` file.

- `KINTARO_BOT_PUBLIC=true`: The bot can be added to any server. It sends a greeting message when joining a new server.
- `KINTARO_BOT_PUBLIC=false`: The bot only works on the authorized server (`GUILD_ID`). When added to another server, it sends a warning and leaves automatically.
- `KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS=true`: At startup, the bot checks all servers it is currently in and leaves those that do not match the authorized `GUILD_ID`.

## 🔷 Standard Bots <a id="standart-bots"></a>

The following **10 bots** share the same lightweight architecture.

`atakan`, `caylak`, `durden`, `flawes`, `leywin`, `luxury`, `micsfo`, `mistazt`, `starx`, `truvaq`

### Standard Bot Features

Each standard bot includes the following capabilities:

- **`/ping` Command**: A simple health-check that responds with "Pong!".
- **Auto Voice Join**: Automatically joins a specified voice channel at configurable intervals (can be toggled on/off with `KINTARO_JUMP_VOICE_AUTO`).
- **Public/Private Mode**: Can be configured to accept all servers or be restricted to a single authorized server.
- **Unauthorized Server Protection**: If the `KINTARO_BOT_PUBLIC` variable is `false`, the bot sends a warning and automatically leaves when joining an unauthorized server.
- **Startup Cleanup**: If `KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS` is enabled at startup, the bot leaves all servers except the authorized one.
- **Member Caching**: Automatically fetches and caches all members at startup for authorized servers.
- **Dynamic Event Loading**: Events are loaded from the `events/` folder based on feature flags.

### Standard Bot Environment Variables

| Variable                                  | Description                                      | Default    |
| ----------------------------------------- | ------------------------------------------------ | ---------- |
| `DISCORD_TOKEN`                           | Bot authentication token                         | —          |
| `CLIENT_ID`                               | Bot application client ID                        | —          |
| `GUILD_ID`                                | Authorized server (guild) ID                     | —          |
| `KINTARO_BOT_PUBLIC`                      | Allow the bot to join any server                 | `false`    |
| `KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS` | Leave unauthorized servers at startup            | `true`     |
| `KINTARO_JUMP_VOICE_AUTO`                 | Enable automatic voice channel join              | `true`     |
| `KINTARO_JUMP_VOICE_AUTO_JOIN_INTERVAL`   | Join check interval (in seconds)                 | `300`      |
| `KINTARO_JUMP_VOICE_AUTO_CHANNEL_ID`      | Target voice channel ID                          | —          |

## ⭐ Main Bot (Kintaro) <a id="main-bot"></a>

**Kintaro** is the main advanced bot of this project. It extends the standard bot template with a comprehensive package, making it a full-featured Discord server management and entertainment bot.

### 🎮 Commands

#### `/ping`

> **Permission:** Everyone

A simple latency check command. Responds with "Pong!" to confirm that the bot is online and responsive.

#

#### `/avatar`

> **Permission:** Everyone

Displays a user's profile picture in full resolution (1024×1024).

| Option  | Type      | Required |
| ------- | --------- | -------- |
| `user`  | User      | ✅       | 

**Features:**

- Supports GIF format
- Displays inside a Discord Embed
- Shows who requested the profile picture

#

#### `/banner`

> **Permission:** Everyone

Displays a user's profile banner in full resolution.

| Option  | Type      | Required |
| ------- | --------- | -------- |
| `user`  | User      | ✅       |

**Features:**

- Fetches user profile with `force: true` to guarantee up-to-date data
- Supports animated banners
- Handles users without set banners smoothly

#

#### `/profile`

> **Permission:** Everyone

Shows a detailed profile card for a user, including comprehensive server-specific information.

| Option  | Type      | Required |
| ------- | --------- | -------- |
| `user`  | User      | ❌       | 

**Displayed Information:**

- Username
- Account creation date
- Server join date
- Account type
- Online/Offline status
- Nitro Boost status and date
- Current voice channel
- All assigned roles

#

#### `/serverstats`

> **Permission:** Everyone

Displays a comprehensive overview of the current server's statistics in a rich embed.

**Displayed Information:**

- Server owner
- Server creation date
- Total member count
- Bot count
- Total channel count
- Text channel count
- Voice channel count
- Role count
- Administrator count
- Full list of all roles
- Full list of all administrator users

#

#### `/botstats`

> **Permission:** Everyone

Displays information about the Kintaro bot itself.

**Displayed Information:**

- Uptime
- Bot creator
- Bot biography/description

#

#### `/clear`

> **Permission:** Manage Messages

Bulk deletes a specified number of messages from the current channel.

| Option   | Type    | Required |
| -------- | ------- | -------- |
| `amount` | Integer | ✅       |

**Features:**

- Uses Discord's bulk delete API for efficient deletion
- Performs authorization check to ensure only authorized users can delete messages

#

#### `/say`

> **Permission:** Administrator

Sends a custom message to a specified text channel.

| Option    | Type    | Required | Description                     |
| --------- | ------- | -------- | ------------------------------- |
| `channel` | Channel | ✅       | Target text channel             |
| `message` | Text    | ✅       | Message content to be sent      |

**Features:**

- Supports multi-line messages using `\n` escape sequences
- Channel type validation to ensure only text channels are selected

#

#### `/copymessage`

> **Permission:** Administrator

Copies a message from one channel to another, preserving content and embeds.

| Option           | Type    | Required | Description                   |
| ---------------- | ------- | -------- | ----------------------------- |
| `target_channel` | Channel | ✅       | Target channel                |
| `source_channel` | Channel | ✅       | Source channel                |
| `message_id`     | Text    | ✅       | ID of the message to be copied|

**Features:**

- Preserves both text content and embed content

#

#### `/rolepicker`

> **Permission:** Administrator

Creates an interactive role picker message containing buttons that users can click to assign/remove roles.

| Option     | Type    | Required | Description                                       |
| ---------- | ------- | -------- | ------------------------------------------------- |
| `channel`  | Channel | ✅       | Channel where the role picker will be sent        |
| `mode`     | Choice  | ✅       | `single_role` or `multi_role`                     |
| `roles`    | Text    | ✅       | Role tags (e.g., `@Role1 @Role2 @Role3`)          |
| `message`  | Text    | ✅       | Description message to be displayed above buttons |

**Features:**

- **Single Role Mode (`single_role`)** — Only one role from the picker can be active at a time. When a new role is selected, the previous one is automatically removed
- **Multi Role Mode (`multi_role`)** — Users can toggle multiple roles independently
- Automatically creates role buttons arranged in rows
- Includes a red "Remove All Roles" button for a quick reset
- Has a 1-second cooldown on button interactions to prevent spam
- Offers multi-line support using `\n` in the description message

#

#### `/jumpvoice`

> **Permission:** Administrator

Makes the bot join the voice channel where the user who executed the command is currently located.

**Features:**

- Uses `@discordjs/voice` for stable voice connections
- Verifies that the user is in a voice channel before attempting to join

#

#### `/ship`

> **Permission:** Everyone

A fun command that generates a compatibility percentage between the user who executed the command and a selected user, accompanied by a custom-generated image.

| Option  | Type      | Required | Description                         |
| ------- | --------- | -------- | ----------------------------------- |
| `user`  | User      | ✅       | The user to ship with               |

**Features:**

- Generates a random compatibility percentage (0–100%)
- Creates a beautiful canvas image with the users' avatars
- Uses **Sharp** for image preprocessing and format conversion

#

### 🎯 Events <a id="events"></a>

#### 1. Entry/Exit Messages (`kintaroEntryExit`)

> **Activation:** `KINTARO_ENTRY_EXIT=true`

Simple welcome and goodbye messages sent to a designated channel when members join or leave the server.

#### 2. Guard System (`kintaroEntryExitGuard`)

> **Activation:** `KINTARO_ENTRY_EXIT_GUARD=true`

An advanced member verification system that requires administrator approval before new members gain full access to the server.

**How it works:**

1. When a new member joins, they are automatically assigned an **Unverified** role.
2. A welcome message is sent to the guard channel, containing the following information:
   - The new member's name/tag and mention
   - Current server member count
   - Invite tracking information (who invited them and which invite code was used)
   - A **"Register"** button for administrators
3. An administrator clicks the **Register** button to approve the member's registration:
   - Removes the **Unverified** role
   - Assigns the **Verified** role
   - Updates the welcome message to show who registered the member
   - Disables the button (changes to green "Registered")
4. If the member leaves the server before being registered:
   - The welcome message is updated with a warning
   - The button is disabled and changes to red "User Left the Server"
   - A goodbye message with a GIF is sent

#### 3. Auto Voice Join (`kintaroJumpVoiceAuto`)

> **Activation:** `KINTARO_JUMP_VOICE_AUTO=true`

Automatically stays AFK in a specific voice channel on the server.

- Checks if the bot is already in the target channel to prevent redundant joins
- Configurable interval (in seconds) via `KINTARO_JUMP_VOICE_AUTO_JOIN_INTERVAL`

#### 4. Auto Responder (`kintaroAutoResponder`)

> **Activation:** `KINTARO_AUTO_RESPONSER=true`

Automatically responds to specific messages with predefined answers. Acts as a fun interaction system for community members.

- Responds to greetings and specific user mentions
- Performs content-based matching with customizable responses
- Ignores messages from other bots

## 🔑 Environment Variables <a id="environment-variables"></a>

```env
# ─── Core Authentication ───
DISCORD_TOKEN=                                # Discord bot token
CLIENT_ID=                                    # Bot application client ID
GUILD_ID=                                     # Authorized server ID

# ─── Access Control ───
KINTARO_BOT_PUBLIC=false                      # Allow bot to join any server
KINTARO_BOT_QUIT_UNVERIFIED_ALL_SERVERS=true  # Leave unauthorized servers at startup

# ─── Entry/Exit Messages ───
KINTARO_ENTRY_EXIT=true                       # Enable simple join/leave messages
KINTARO_ENTRY_EXIT_WELCOME_CHANNEL=           # Channel ID for join/leave messages

# ─── Guard System ───
KINTARO_ENTRY_EXIT_GUARD=true                 # Enable verification guard system
KINTARO_ENTRY_EXIT_GUARD_WELCOME_CHANNEL=     # Channel ID for guard welcome messages
KINTARO_ENTRY_EXIT_GUARD_UNVERIFIED_ROLE=     # Role ID assigned to unverified members
KINTARO_ENTRY_EXIT_GUARD_VERIFIED_ROLE=       # Role ID assigned after verification

# ─── Auto Voice Join ───
KINTARO_JUMP_VOICE_AUTO=true                  # Enable automatic voice channel join
KINTARO_JUMP_VOICE_AUTO_JOIN_INTERVAL=300     # Check interval (in seconds) (default: 300)
KINTARO_JUMP_VOICE_AUTO_CHANNEL_ID=           # Target voice channel ID

# ─── Auto Responder ───
KINTARO_AUTO_RESPONSER=true                   # Enable automatic message responses
```

## 🚀 Installation <a id="installation"></a>

### Requirements <a id="gereksinimler"></a>

- **Node.js**: v18 or higher
- **npm**: Comes with Node.js

### Step-by-Step Installation

1. **Clone the repository:**

```bash
git clone https://github.com/xkintaro/kintaro-discord-bots.git
cd kintaro-discord-bots
```

2. **Install all bot dependencies at once:**

```bash
node install-requirements.js
```

This command will run `npm install` in each bot folder under `all/`.

3. **Configure environment variables:**

Configure the `.env` file in the root directory of each bot. Enable/disable features as desired.

```env
DISCORD_TOKEN=
CLIENT_ID=
GUILD_ID=
```

4. **Deploy Slash Commands:**

Before using slash commands, you must register them with Discord:

```bash
node deploy.js
```

This will run `node deploy.js` inside each bot directory to register all slash commands.

5. **Run the Bots:**

```bash
node run.js
```

Each bot will run as a separate child process.


## 📂 Project Structure <a id="project-structure"></a>

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

## 📄 License <a id="license"></a>

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

#

<p align="center">
  <sub>❤️ Developed by "Mustafa TAŞAL" (kintaro)</sub>
</p>