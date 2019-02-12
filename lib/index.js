const Telegraf = require('telegraf');
const api = require('./api');
const Task = require('./task');

const TOKEN = process.env.BOT_TOKEN;

const tasks = [];

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

    bot.command('/subscribe', async(ctx) => {
        const c = ctx.message.text.split(' ');

        const interval = parseInt(c[1]);
        const command = c[2];
        const url = c[3];
        const arg = c[4];

        const task = new Task({
            chatId: ctx.chat.id,
            interval,
        });

        if (command === 'tickets') {
            task.fn = async() => {
                try {
                    const tickets = await api.getTickets(url, arg);
                    bot.sendMessage(ctx.chat.id, tickets);
                } catch (e) {
                    bot.sendMessage(ctx.chat.id, 'Ошибка');
                }
            }
        }
        if (command === 'tickets_any') {
            task.fn = async() => {
                try {
                    const tickets = await api.getTicketsBySpec(url, arg);
                    bot.sendMessage(ctx.chat.id, tickets);
                } catch (e) {
                    bot.sendMessage(ctx.chat.id, 'Ошибка');
                }
            }
        }
        task.run();
        tasks.push(task);
    });

    bot.command('/unsuscribe', async(ctx) => {
        tasks.find(t => t.chatId == ctx.chat.id).stop();
    });

    bot.launch();
};

main();
