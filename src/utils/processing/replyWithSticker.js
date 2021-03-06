'use strict';

const convertToSticker = require('./convertToSticker');
const sendLog = require('../general/sendLog');
const replyWithError = require('../general/replyWithError');

module.exports = async (ctx, data, user, result) => {
    try {
        const sticker = await convertToSticker(result.buffer, data.text);

        await ctx.deleteMessage(ctx.message.message_id + 1).catch(() => {});
        
        ctx.replyWithSticker({ source: sticker }, {
            reply_to_message_id: ctx.message.message_id
        }).catch(() => replyWithError(ctx, 14));

        const services = {
            0: 'cutout.pro',
            1: 'benzin.io',
            2: 'experte.de',
            3: 'erase.bg'
        };

        sendLog({
            type: 'common',
            id: ctx.from.id,
            username: user.username,
            name: ctx.from.first_name,
            query_type: data.message.type,
            action: 1, // 0 - no-bg image / 1 - sticker
            size: result.initial_file_size,
            usage: user.usage,
            to_sticker: user.converted_to_sticker,
            to_file: user.converted_to_file,
            language: user.language,
            registered: user.timestamp,
            timestamp: new Date(),
            file_id: data.message.file_id,
            service: services[data.service]
        });
    } catch (err) {
        console.error(err);
    }
};