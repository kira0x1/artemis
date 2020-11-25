import { Message, MessageEmbed } from "discord.js";

const redColor = 0xcf274e;
// const blueColor = 0x4e74e6;
// const oldBlueColor = 0x6788eb;

export const embedColor = redColor;

export function createFooter(message: Message): MessageEmbed {
    const author = message.author

    const embed = new MessageEmbed()
        .setColor(embedColor)
        .setFooter(author.username, author.avatarURL({ dynamic: true }))
        .setTimestamp(Date.now());

    return embed;
}

export function QuickEmbed(message: Message, content: string) {
    const embed = new MessageEmbed().setTitle(content).setColor(embedColor);
    message.channel.send(embed);
}

export function createEmptyField(inline?: boolean | false) {
    return { name: `\u200b`, value: '\u200b', inline: true };
}


export function wrap(content: string[] | string, wrap: string = '`'): string {
    if (typeof content === 'string') return wrap + content + wrap;

    return content
        .filter(str => str !== ``)
        .map(str => wrap + str + wrap)
        .join(' ');
}