const User = require('../../database/models/User');

module.exports = async (ctx, user, data) => {
    await User.updateOne({ id: ctx.from.id }, { 
        $inc: { 
            usage: 1,
            converted_to_sticker: (user.to_sticker) ? 1 : 0,
            converted_to_file: (user.to_sticker) ? 0 : 1
        },
        $set: { last_time_used: new Date() },
        $push: { files: { file_id: data.message.file_id, output: data.output, timestamp: new Date() } }
    }, () => {});
    
    ctx.session.user.usage = user.usage + 1;
    ctx.session.user.converted_to_sticker = (user.to_sticker) ? (user?.converted_to_sticker || 0) + 1 : (user?.converted_to_sticker || 0);
    ctx.session.user.converted_to_file = (user.to_sticker) ? (user?.converted_to_file || 0) : (user?.converted_to_file || 0) + 1;
};