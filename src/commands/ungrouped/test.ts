import { Command } from "../../util/command-util";

export const command: Command = {
    name: 'Test',
    description: 'Test command',
    aliases: ['t'],
    perms: ['ADMINISTRATOR'],

    execute(message, args) {
        message.channel.send('meow')
    }
}