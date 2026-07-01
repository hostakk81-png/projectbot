import axios from 'axios';

const sharedInstance = axios.create({
    baseURL: process.env.API_URL + '/api'
});

export { sharedInstance };
