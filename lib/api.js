const axios = require('axios');

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/check'
});

module.exports = {
    async getSpecs(url) {
        const { data } = await axiosInstance.get('/specs', {
            params: {
                url
            }
        });
        return data;
    },

    async getDoctors(url, doctorKey) {
        const { data } = await axiosInstance.get('/doctors', {
            params: {
                url,
                name: 'doesnt matter',
                key: doctorKey
            }
        });
        return data;
    },

    async getTickets(url, doctorKey) {
        const { data } = await axiosInstance.get('/tickets', {
            params: {
                url,
                name: 'doesnt matter',
                key: doctorKey
            }
        });
        return data.filter(i => i.available || i.reserved).map(i => i.dateTime);
    },

    async getTicketsBySpec(url, specKey) {
        const { data } = await axiosInstance.get('/ticketsspec', {
            params: {
                url,
                name: 'doesnt matter',
                key: specKey
            }
        });
        return data.filter(i => i.available || i.reserved).map(i => i.dateTime);
    },
};
