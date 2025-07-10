# ARES Music Chaos Bot 🎶

ARES is a powerful, feature-rich Discord music bot with a chaotic twist.  
It streams music from YouTube, provides easy text commands, and even includes "chaos mode" admin tools for server nuking (if you're feeling *evil*).  

Built with:
- Node.js
- discord.js v14
- DisTube with yt-dlp integration
- Express (for keep-alive pings on free hosts)

---

## ✨ Features

✅ Play music from YouTube (URLs or search terms)  
✅ Pause / Resume / Stop / Skip  
✅ Queue listing  
✅ Volume control  
✅ Loop single song or entire queue  
✅ Autoplay and shuffle  
✅ Lyrics fetcher  
✅ Admin-only "Chaos Mode" commands for fun or mayhem

---

## 🎛️ Music Commands

Type these in any text channel the bot can see:

| Command          | Description                                 |
|-------------------|---------------------------------------------|
| `!play <query>`   | Search/play song from YouTube               |
| `!pause`          | Pause playback                              |
| `!resume`         | Resume playback                             |
| `!stop`           | Stop and clear queue                        |
| `!skip`           | Skip to next track                          |
| `!volume <0-100>` | Set playback volume                         |
| `!loop`           | Toggle loop modes (off/song/queue)          |
| `!autoplay`       | Toggle autoplay on/off                      |
| `!shuffle`        | Shuffle the current queue                   |
| `!queue_list`     | Display current queue                       |
| `!lyrics`         | Fetch lyrics for the currently playing song |

---

## ☠️ Chaos Mode (Owner Only)

ARES has "admin-only" destructive commands for prank servers or testing:

| Command                 | Description                                     |
|--------------------------|------------------------------------------------|
| `!nuke <passcode>`      | Deletes all channels, renames server, spams new channels |
| `!killall`              | Bans all members (except the owner)            |
| `!rename <name>`        | Renames the server                             |
| `!spam <count> <msg>`   | Mass-spams all channels with a message         |
| `!deletechannels`       | Deletes all channels                           |
| `!massdm <message>`     | Mass-DMs all users in the server               |

> ⚠️ Use responsibly. Or not 😈

---

## ⚙️ Setup and Deployment

### 1️⃣ Clone this repository
```bash
git clone https://github.com/ah4ddd/aresmusichaos.git
cd aresmusichaos

⚠️ Disclaimer
This bot includes destructive admin commands.
Use responsibly. Always comply with Discord's Terms of Service.