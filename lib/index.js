const Telegraf = require('telegraf');
const axios = require('axios');

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/check'
});

const TOKEN = process.env.BOT_TOKEN;

const api = {
    async getSpecs(url) {
        const { data } = await axiosInstance.get('/specs', {
            params: {
                url,
            }
        });
        return data;
    },

    async getDoctors(url, doctorKey) {
        const { data } = await axiosInstance.get('/doctors', {
            params: {
                url,
                name: 'doesnt matter',
                key: doctorKey,
            }
        });
        return data;
    },

    async getTickets(url, doctorKey) {
        const { data } = await axiosInstance.get('/tickets', {
            params: {
                url,
                name: 'doesnt matter',
                key: doctorKey,
            }
        });
        return data
            .filter(i => i.available || i.reserved)
            .map(i => i.dateTime);

    }
};
const main = () => {
    const bot = new Telegraf(TOKEN);

    bot.command('/specs', async(ctx) => {
        const url = ctx.message.text.split(' ')[1];
        if (!url) {
            ctx.reply(
                'Введи адрес клиники. Например http://94.19.37.202:3008/'
            );
        } else {
            const spec = await api.getSpecs(url);
            ctx.reply(JSON.stringify(spec));
        }   
    });

    bot.command('/docs', async(ctx) => {
        const url = ctx.message.text.split(' ')[1];
        const doctorKey = ctx.message.text.split(' ')[2];

        const docs = await api.getDoctors(url, doctorKey);
        ctx.reply(JSON.stringify(docs));
    });

    bot.command('/tickets', async(ctx) => {
        const url = ctx.message.text.split(' ')[1];
        const doctorKey = ctx.message.text.split(' ')[2];

        const tickets = await api.getTickets(url, doctorKey);
        ctx.reply(JSON.stringify(tickets));
    });

    bot.launch();
};

main();
