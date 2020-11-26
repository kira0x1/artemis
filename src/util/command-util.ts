import { Collection, Message, MessageEmbed, PermissionString } from 'discord.js'
import { readdirSync } from 'fs'
import path from 'path'
import { embedColor, wrap } from './styleUtil'

export const commands: Collection<string, Command> = new Collection()
export const commandGroups: Collection<string, Command[]> = new Collection()
export const commandInfos: Collection<string, CommandInfo> = new Collection()

export function findCommand(query: string): Command | undefined {
  let command = commands.get(query.toLowerCase())
  if (!command) {
    command = commands.find(cmd => cmd.aliases && cmd.aliases.includes(query))
  }
  return command
}

export function findCommandInfo(query: string) {
  query = query.toLowerCase()
  return commandInfos.find(
    info => info.name.toLowerCase() === query || info.aliases.includes(query)
  )
}

export function sendArgsError(command: Command, message: Message) {
  let usageString = 'Arguments required'
  const embed = new MessageEmbed().setColor(embedColor)

  if (command.usage) {
    usageString = command.name + ' '
    usageString += wrap(command.usage, '`')
  }

  embed.addField('Arguments Required', usageString)
  return message.channel.send(embed)
}

export async function FindMember(message: Message, query: string) {
  query = query.toLowerCase()

  const mention = message.mentions.users.first()
  if (mention !== undefined) return message.mentions.members.first()

  const guild = message.guild

  let member = guild.members.cache.find(
    m => m.displayName.toLowerCase() === query || m.id === query
  )
  if (member) return member

  const memberSearch = await guild.members.fetch({ query: query, limit: 1 })
  if (memberSearch && memberSearch.first()) return memberSearch.first()
}

export interface CommandInfo {
  name: string
  description: string
  commands: Command[]
  aliases: string[]
  perms?: string[]
  hidden?: boolean
  requiresPrefix?: boolean
  override?: string
}

export interface Command {
  name: string
  aliases: string[]
  description: string
  args?: boolean
  usage?: string
  perms?: PermissionString[]

  execute(message: Message, args: string[]): void
}

export function initCommands() {
  const infos: CommandInfo[] = []

  readdirSync(path.join(__dirname, '..', 'commands', 'info'))
    .filter(file => file.endsWith('js'))
    .map(file => {
      const { info } = require(path.join(__dirname, '..', 'commands', 'info', file))
      infos.push(info)
    })

  readdirSync(path.join(__dirname, '..', 'commands'))
    .filter(folder => folder !== 'info')
    .map(folder => {
      const folderCommands: Command[] = []
      readdirSync(path.join(__dirname, '../commands', folder)).map(file => {
        const { command } = require(path.join(__dirname, '../commands', folder, file))

        const cmd: Command = command
        folderCommands.push(cmd)
        commands.set(cmd.name.toLowerCase(), cmd)
      })

      commandGroups.set(folder, folderCommands)

      let info = infos.find(cmd => cmd.name.toLowerCase() === folder)

      if (info) {
        const commandsFound = commandGroups.get(info.name.toLowerCase()) || []
        info.commands = commandsFound
        commandInfos.set(info.name.toLowerCase(), info)
      }
    })
}
