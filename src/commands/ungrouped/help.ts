import { Message, MessageEmbed } from "discord.js";
import { Command, commandGroups, commandInfos } from "../../util/command-util";
import { embedColor } from "../../util/styleUtil";

export const command: Command = {
  name: "Help",
  description: "",
  usage: "",
  aliases: ["h"],

  async execute(message, args) {
    const query = args.join(" ");
    if (!query) {
      displayAll(message);
    } else {
    }
  },
};

function displayAll(message: Message) {
  const grouped: Command[] = [];

  //Add all grouped commands to the grouped array so we can cross
  //reference this later to check for ungrouped commands
  commandGroups.map((grp) => {
    grp.map((cmd) => {
      //   if (hasPerms(message.author.id, cmd.name) && !cmd.hidden && !cmd.isDisabled)
      grouped.push(cmd);
    });
  });

  //Create embed
  const embed = new MessageEmbed();
  embed.setTitle("Commands");
  embed.setColor(embedColor);

  //Add all ungrouped commands to the embed
  const ungrouped = commandGroups.get("ungrouped");
  if (ungrouped) {
    ungrouped.map((cmd) => {
      //   if (hasPerms(message.author.id, cmd.name) && !cmd.hidden)
      embed.addField(cmd.name, cmd.description);
    });
  }

  //Add all group commands info to the embed
  commandInfos.map((info) => {
    // if (hasPerms(message.author.id, info.name))
    embed.addField(info.name, info.description);
  });

  message.channel.send(embed);
}
