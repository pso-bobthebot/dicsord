"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const config_1 = tslib_1.__importDefault(require("./config"));
const { prefix } = config_1.default;
const commands = {
    'main': {
        'help': {
            description: 'Shows the list of commands and their details.\nSections: main (default), profile',
            format: 'help <?section>'
        },
        'credits': {
            aliases: ['creators', 'developers', 'devs'],
            description: 'Shows the creators',
            format: 'credits'
        },
        'ping': {
            description: 'Checks response time.',
            format: 'ping'
        },
        'say': {
            aliases: ['repeat'],
            description: 'Repeats back the text specified.',
            format: 'say <!message>'
        }
    },
    'profile': {
        'profile create': {
            description: 'Creates your profile so you can use the profile commands',
            format: 'profile create'
        },
        'profile stats': {
            aliases: ['statistics', 'view'],
            description: 'Shows your profile\'s or somebody else\'s statistics',
            format: 'profile stats <?mention>'
        },
        'profile mine': {
            description: 'Gives you a random amount (0 to 2) of money',
            format: 'profile mine'
        },
        'profile trade': {
            description: 'Giving a amount of money to another user',
            format: 'profile trade <!amount> <!ping>'
        },
        'profile bet': {
            description: 'Random chance of either gaining or losing money',
            format: 'profile bet <!amount>'
        }
    }
};
function helpCommand(message, section) {
    if (section === undefined || commands[section] === undefined) {
        section = "main";
    }
    const footerText = message.author.tag;
    const footerIcon = message.author.displayAvatarURL();
    const embed = new discord_js_1.MessageEmbed()
        .setTitle('Help')
        .setColor('#ff0044')
        .setFooter({ text: footerText, iconURL: footerIcon });
    for (const commandName of Object.keys(commands[section])) {
        const command = commands[section][commandName];
        let desc = command.description + '\n';
        if (command.aliases) {
            desc += `**Aliases:** ${command.aliases.join(', ')}\n`;
        }
        desc += '```' + prefix + command.format + '```';
        embed.addField(commandName, desc, false);
    }
    return embed;
}
exports.default = helpCommand;
//# sourceMappingURL=commands.js.map