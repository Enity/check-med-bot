const Telegraf = require('telegraf');
const api = require('./api');

const TOKEN = process.env.BOT_TOKEN;

const main = () => {
    const bot = new Telegraf(TOKEN);

    bot.command('/specs', async(ctx) => {
        const url = ctx.message.text.split(' ')[1];
        if (!url) {
            ctx.reply(
                'Введи адрес клиники. Например http://94.19.37.202:3008/'
            );
        } else {
            try {
                const spec = await api.getSpecs(url);
                ctx.reply(JSON.stringify(spec));
            } catch (e) {
                ctx.reply("Ошибка!");
            }
        }   
    });

    bot.command('/docs', async(ctx) => {
        const url = ctx.message.text.split(' ')[1];
        const specKey = ctx.message.text.split(' ')[2];

        try {
            const docs = await api.getDoctors(url, specKey);
            ctx.reply(JSON.stringify(docs));
        } catch (e) {
            ctx.reply("Ошибка!");
        }
        
    });

    bot.command('/tickets', async(ctx) => {
        const url = ctx.message.text.split(' ')[1];
        const doctorKey = ctx.message.text.split(' ')[2];

        try {
            const tickets = await api.getTickets(url, doctorKey);
            ctx.reply(JSON.stringify(tickets));
        } catch (e) {
            ctx.reply("Ошибка!");
        }
    });

    bot.command('/tickets_any', async(ctx) => {
        const url = ctx.message.text.split(' ')[1];
        const specKey = ctx.message.text.split(' ')[2];

        try {
            const tickets = await api.getTicketsBySpec(url, specKey);
            ctx.reply(JSON.stringify(tickets));
        } catch (e) {
            ctx.reply("Ошибка!");
        }
    });

    bot.launch();
};

main();
