import { query } from "express";
import { Command, FindMember } from "../../util/command-util";
import { createFooter, QuickEmbed } from "../../util/styleUtil";

export const command: Command = {
  name: "UserInfo",
  description: "Retrieve information about a user",
  aliases: ["uinfo"],
  args: true,
  usage: "[ID | TAG | NAME]",

  async execute(message, args) {
    const query = args.join(" ");
    const target = await FindMember(message, query);
    if (!target) return QuickEmbed(message, `User ${query} not found`);

    const embed = createFooter(message)
      .setTitle("User info")
      .setDescription(`User info for ${target}`)
      .setThumbnail(target.user.avatarURL({ dynamic: true, size: 4096 }))
      .addField("User ID", `\`${target.id}\``)
      .addField("Created at", target.user.createdAt.toUTCString())
      .addField("Joined at", target.joinedAt.toUTCString());

    message.channel.send(embed);
  },
};
