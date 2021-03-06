async function moveUsers(channels, channel) {
    const main = await channels.cache.find(c => c.name === 'Main')
    await channel.members.forEach(member => {
        async function mover() {
            if (member.voice.channelID) {
                await member.voice.setChannel(main)
            }
        }
        mover()
    })
}

module.exports = {
    name: 'move-back',
    description: 'Move all users in grouping rooms back to main channel',
    async execute(message, args) {
        const guild = message.guild
        const channels = guild.channels
        const roles = guild.roles

        const teacherRole = roles.cache.find(r => r.name.toLowerCase() === 'teacher')

        if (!message.member.roles.cache.has(teacherRole.id)) {
             message.channel.send('Only teachers can use this command')
             return;
        }

        const classroom = channels.cache.find(c => c.name.toLowerCase() === 'classroom' && c.type === 'category')
        classroom.children.forEach(channel => {
            if (channel.name != 'Main' && channel.parent === classroom && channel.type === 'voice') {
                moveUsers(channels, channel)
            }
        })
    }
}