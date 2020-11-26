import { Message, MessageEmbed } from 'discord.js'
import { prefix } from '../../config'
import {
   Command,
   commandGroups,
   commandInfos,
   findCommand,
   findCommandInfo,
} from '../../util/command-util'
import { createFooter, embedColor, wrap } from '../../util/styleUtil'

export const command: Command = {
   name: 'Help',
   description: 'lists all commands',
   aliases: ['h'],

   execute(message, args) {
      const query = args.join(' ')
      if (!query) {
         displayAll(message)
      } else {
         displayOne(message, query)
      }
   },
}

function displayAll(message: Message) {
   const grouped: Command[] = []

   //Add all grouped commands to the grouped array so we can cross
   //reference this later to check for ungrouped commands
   commandGroups.map(grp => {
      grp.map(cmd => {
         //   if (hasPerms(message.author.id, cmd.name) && !cmd.hidden && !cmd.isDisabled)
         grouped.push(cmd)
      })
   })

   //Create embed
   const embed = new MessageEmbed().setTitle('Commands').setColor(embedColor)

   //Add all ungrouped commands to the embed
   const ungrouped = commandGroups.get('ungrouped')
   if (ungrouped) {
      ungrouped.map(cmd => {
         //   if (hasPerms(message.author.id, cmd.name) && !cmd.hidden)
         embed.addField(cmd.name, cmd.description)
      })
   }

   //Add all group commands info to the embed
   commandInfos.map(info => {
      // if (hasPerms(message.author.id, info.name))
      embed.addField(info.name, info.description)
   })

   message.channel.send(embed)
}

function displayOne(message: Message, query: string) {
   const command = findCommand(query)
   const info = findCommandInfo(query)

   if (!command && !info) {
      message.author.send(`Command ${wrap(query)} not found`)
      return
   }

   const embed = createFooter(message)

   if (command) {
      InsertCommandEmbed(embed, command)
      return message.channel.send(embed)
   }

   //? If we dont have the command, then it must be an info group
   //If the info group doesnt have any commands exit out
   if (!info.commands) return

   //Loop through all the commands in the CommandInfo class
   info.commands.map(cmd => {
      let desc = cmd.description

      //Add aliases to the description
      if (cmd.aliases) desc += `\naliases: ${wrap(cmd.aliases, '`')}`

      //Add Usage's
      desc += `\n${getUsage(cmd)}`

      //Add command to the embed
      embed.addField(cmd.name.toLowerCase(), desc)
   })

   message.channel.send(embed)
}

function InsertCommandEmbed(embed: MessageEmbed, command: Command) {
   embed.setTitle(command.name)
   embed.setDescription(command.description)

   if (command.usage) {
      embed.addField('Usage', wrap(command.usage, '`'))
   }

   if (command.aliases) {
      const aliasesString = wrap(command.aliases, '`')
      embed.addField('aliases: ', aliasesString)
   }
   return embed
}

function getUsage(command: Command): string {
   let usage = ``
   if (command.usage) {
      usage = wrap(`${prefix}${command.name} ${command.usage}`, '`')
   }

   return usage
}
