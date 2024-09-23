import { defineStore } from "pinia";
import axios from "axios";


export const scrapTallyStore = defineStore("scrapTally", {
    actions: {
        async postScrap(payload) {
            try {
                const response = await axios.post('https://192.168.0.154:4040/scrap-tally', payload, {})
                return response
            } catch(error) {
                throw error
            }
        },
        async updateScrap(payload) {
            try {
                const response = await axios.patch('https://192.168.0.154:4040/scrap-tally', payload, {})
                return response
            } catch(error) {
                throw error
            }
        },
        async deleteScrap(payload) {
            try {
                const response = await axios.delete('https://192.168.0.154:4040/scrap-tally', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: payload
                })
                return response
            } catch(error) {
                throw error
            }
        }
    }
});
// https://192.168.0.154:4040