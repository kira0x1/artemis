import chalk from "chalk";
import { Client } from "discord.js";
import { token } from "./config";
import { wrap } from "./util/styleUtil";
import { findCommand, initCommands, sendArgsError } from "./util/command-util";

const client = new Client()

client.on('ready', () => {
    console.log(chalk.bgMagenta.bold(`${client.user.username} is online!`))
    initCommands();
})

const prefix = '$'

client.on('message', message => {
    if (message.author.bot || !message.content.startsWith(prefix)) {
        return
    }

    let args = message.content.slice(prefix.length).split(/ +/)

    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return

    const command = findCommand(commandName)

    if (!command) {
        console.log(commandName)
        return message.author.send(`command ${wrap(commandName || '')} not found`);
    }

    if (command.args && args.length === 0) return sendArgsError(command, message);

    try {
        command.execute(message, args)
    } catch (err) {
        console.error(err)
    }
})

client.login(token)