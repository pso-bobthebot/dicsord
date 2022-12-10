import { Client, User } from 'discord.js';
import config from './config';
import helpCommand from './commands';
import {
  createProfile, getProfile, saveProfile,
  Profile
} from './supabase'

//express server to run uptimerobot check
const wserver = require('express')();
const port = 3000;
wserver.get('/', (_: any, r2: any) => r2.send('webserver online'));

wserver.listen(port, () => console.log(`webserver online`));

const { intents, prefix, token } = config;

const client = new Client({
  intents,
  presence: {
    status: 'dnd',
    activities: [{
      name: `${prefix}help`,
      type: 'LISTENING'
    }]
  }
});

client.on('ready', () => {
  console.log(`Viewing app as: ${client.user?.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift();

    switch(command) {
      case 'ping':
        const msg = await message.reply('Pinging...');
        await msg.edit(`<:developer:1050727256349229197> Pong! Time taken: ${Date.now() - msg.createdTimestamp}ms.`);
        break;

      case 'say':
      case 'repeat':
        if (args.length > 0) await message.channel.send(args.join(' '));
        else await message.reply('<:developer:1050727256349229197> Error: Message content is missing.');
        break;

      case 'help':
        const embed = helpCommand(message, args[0]);
        embed.setThumbnail(client.user!.displayAvatarURL());
        await message.channel.send({ embeds: [embed] });
        break;

      case 'credits':
      case 'creators':
      case 'developers':
      case 'devs':
        message.reply('**Credits:**\nNoahDev#6117 - Bot Owner\njwklong#5248 - Developer\ndevelopertest#2474 - Developer')
        break;

      case 'profile':
        const subcommand = args.shift();
        switch (subcommand) {
          case 'create':
            try {
              createProfile(Number(message.author.id))
              message.reply('The profile was created successfully!')
            } catch (err) {
              message.reply('ERROR: The profile was already created')
            }
            break;

          case 'mine':
            getProfile(Number(message.author.id)).then(function(profile: Profile | undefined) {
              if (profile !== undefined) {
                const random = Math.random() * 100
                let money: number
                if (random <= 30) {
                  money = 0
                } else if (random <= 80) {
                  money = 1
                } else {
                  money = 2
                }
                if (money > 0) {
                  message.reply(`You have successfully mined ${money} money`)
                  profile.money += money
                  saveProfile(profile)
                } else {
                  message.reply(`No money was found! Better luck next time...`)
                }
              } else {
                message.reply(`ERROR: You must create a profile first using \`${prefix}profile create\``)
              }
            })
            break;
            
          case 'bet':
            getProfile(Number(message.author.id)).then(function(profile: Profile | undefined) {
              if (profile !== undefined) {
                const bet = Math.floor(Number(args[0] || 0))
                if (bet > 0 && bet <= profile.money) {
                  if (Math.random() > 0.5) {
                    message.reply(`You won the bet! +${bet}`)
                    profile.money += bet
                  } else {
                    message.reply(`You lost the bet. -${bet}`)
                    profile.money -= bet
                  }
                  saveProfile(profile)
                } else {
                  message.reply('ERROR: Invalid amount of money betted')
                }
              } else {
                message.reply(`ERROR: You must create a profile first using \`${prefix}profile create\``)
              }
            })
            break;

          case 'stats':
          case 'statistics':
          case 'view':
            let statuser: User = message.mentions.users.first() || message.author
            getProfile(Number(statuser.id)).then(function(profile: Profile | undefined) {
              if (profile !== undefined) {
                message.reply(`**${statuser.tag}'s Statistics**\nMoney: ${profile.money}\nGems: ${profile.gems}`)
              } else {
                message.reply(`ERROR: You must create a profile first using \`${prefix}profile create\``)
              }
            })
            break;

          case 'give':
          case 'trade':
            let giveuser: User | undefined = message.mentions.users.first()
            if (giveuser !== undefined && giveuser!.id != message.author.id) {
              getProfile(Number(giveuser.id)).then(function(partner: Profile | undefined) {
                if (partner !== undefined) {
                  getProfile(Number(message.author.id)).then(function(profile: Profile | undefined) {
                    if (profile !== undefined) {
                      const trade = Math.floor(Number(args[0] || 0))
                      if (trade > 0 && trade <= profile.money) {
                        partner.money += trade
                        profile.money -= trade
                        saveProfile(partner)
                        saveProfile(profile)
                        message.reply(`${trade} money has been given to <@${partner.id}>`)
                      }
                    } else {
                      message.reply(`ERROR: You must create a profile first using \`${prefix}profile create\``)
                    }
                  })
                } else {
                  message.reply(`ERROR: The user you would like to trade with does not have a profile`)
                }
              })
            } else {
              message.reply(`ERROR: Invalid user`)
            }
        }
        break;
    }
  }
});

client.login(token);
