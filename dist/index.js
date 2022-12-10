"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const config_1 = tslib_1.__importDefault(require("./config"));
const commands_1 = tslib_1.__importDefault(require("./commands"));
const supabase_1 = require("./supabase");
//express server to run uptimerobot check
const wserver = require('express')();
const port = 3000;
wserver.get('/', (_, r2) => r2.send('webserver online'));
wserver.listen(port, () => console.log(`webserver online`));
const { intents, prefix, token } = config_1.default;
const client = new discord_js_1.Client({
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
    if (message.author.bot)
        return;
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).split(' ');
        const command = args.shift();
        switch (command) {
            case 'ping':
                const msg = await message.reply('Pinging...');
                await msg.edit(`<:developer:1050727256349229197> Pong! Time taken: ${Date.now() - msg.createdTimestamp}ms.`);
                break;
            case 'say':
            case 'repeat':
                if (args.length > 0)
                    await message.channel.send(args.join(' '));
                else
                    await message.reply('<:developer:1050727256349229197> Error: Message content is missing.');
                break;
            case 'help':
                const embed = (0, commands_1.default)(message, args[0]);
                embed.setThumbnail(client.user.displayAvatarURL());
                await message.channel.send({ embeds: [embed] });
                break;
            case 'credits':
            case 'creators':
            case 'developers':
            case 'devs':
                message.reply('**Credits:**\nNoahDev#6117 - Bot Owner\njwklong#5248 - Developer\ndevelopertest#2474 - Developer');
                break;
            case 'profile':
                const subcommand = args.shift();
                switch (subcommand) {
                    case 'create':
                        try {
                            (0, supabase_1.createProfile)(Number(message.author.id));
                            message.reply('The profile was created successfully!');
                        }
                        catch (err) {
                            message.reply('ERROR: The profile was already created');
                        }
                        break;
                    case 'mine':
                        (0, supabase_1.getProfile)(Number(message.author.id)).then(function (profile) {
                            if (profile !== undefined) {
                                const random = Math.random() * 100;
                                let money;
                                if (random <= 30) {
                                    money = 0;
                                }
                                else if (random <= 80) {
                                    money = 1;
                                }
                                else {
                                    money = 2;
                                }
                                if (money > 0) {
                                    message.reply(`You have successfully mined ${money} money`);
                                    profile.money += money;
                                    (0, supabase_1.saveProfile)(profile);
                                }
                                else {
                                    message.reply(`No money was found! Better luck next time...`);
                                }
                            }
                            else {
                                message.reply(`ERROR: You must create a profile first using \`${prefix}profile create\``);
                            }
                        });
                        break;
                    case 'bet':
                        (0, supabase_1.getProfile)(Number(message.author.id)).then(function (profile) {
                            if (profile !== undefined) {
                                const bet = Math.floor(Number(args[0] || 0));
                                if (bet > 0 && bet <= profile.money) {
                                    if (Math.random() > 0.5) {
                                        message.reply(`You won the bet! +${bet}`);
                                        profile.money += bet;
                                    }
                                    else {
                                        message.reply(`You lost the bet. -${bet}`);
                                        profile.money -= bet;
                                    }
                                    (0, supabase_1.saveProfile)(profile);
                                }
                                else {
                                    message.reply('ERROR: Invalid amount of money betted');
                                }
                            }
                            else {
                                message.reply(`ERROR: You must create a profile first using \`${prefix}profile create\``);
                            }
                        });
                        break;
                    case 'stats':
                    case 'statistics':
                    case 'view':
                        let statuser = message.mentions.users.first() || message.author;
                        (0, supabase_1.getProfile)(Number(statuser.id)).then(function (profile) {
                            if (profile !== undefined) {
                                message.reply(`**${statuser.tag}'s Statistics**\nMoney: ${profile.money}\nGems: ${profile.gems}`);
                            }
                            else {
                                message.reply(`ERROR: You must create a profile first using \`${prefix}profile create\``);
                            }
                        });
                        break;
                    case 'give':
                    case 'trade':
                        let giveuser = message.mentions.users.first();
                        if (giveuser !== undefined && giveuser.id != message.author.id) {
                            (0, supabase_1.getProfile)(Number(giveuser.id)).then(function (partner) {
                                if (partner !== undefined) {
                                    (0, supabase_1.getProfile)(Number(message.author.id)).then(function (profile) {
                                        if (profile !== undefined) {
                                            const trade = Math.floor(Number(args[0] || 0));
                                            if (trade > 0 && trade <= profile.money) {
                                                partner.money += trade;
                                                profile.money -= trade;
                                                (0, supabase_1.saveProfile)(partner);
                                                (0, supabase_1.saveProfile)(profile);
                                                message.reply(`${trade} money has been given to <@${partner.id}>`);
                                            }
                                        }
                                        else {
                                            message.reply(`ERROR: You must create a profile first using \`${prefix}profile create\``);
                                        }
                                    });
                                }
                                else {
                                    message.reply(`ERROR: The user you would like to trade with does not have a profile`);
                                }
                            });
                        }
                        else {
                            message.reply(`ERROR: Invalid user`);
                        }
                }
                break;
        }
    }
});
client.login(token);
//# sourceMappingURL=index.js.map