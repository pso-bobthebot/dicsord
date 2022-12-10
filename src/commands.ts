import { Message, MessageEmbed } from 'discord.js';
import config from './config';

const { prefix } = config;

type Help = {
  [section: string]: {
    [command: string]: {
      aliases?: string[];
      description: string;
      format: string
    }
  }
}

const commands: Help = {
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
}

export default function helpCommand(message: Message, section: string) {
  if (section === undefined || commands[section] === undefined) {
    section = "main"
  }
  const footerText = message.author.tag;
  const footerIcon = message.author.displayAvatarURL();
  const embed = new MessageEmbed()
    .setTitle('Help')
    .setColor('#ff0044')
    .setFooter({ text: footerText, iconURL: footerIcon });

  for (const commandName of Object.keys(commands[section])) {
    const command = commands[section][commandName];
    let desc = command.description + '\n';
    if (command.aliases) { desc += `**Aliases:** ${command.aliases.join(', ')}\n` }
    desc += '```' + prefix + command.format + '```';

    embed.addField(commandName, desc, false);
  }

  return embed;
}