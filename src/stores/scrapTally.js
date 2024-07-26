import { defineStore } from "pinia";
import axios from "axios";


export const scrapTallyStore = defineStore("scrapTally", {
    actions: {
        async postScrap(payload) {
            try {
                const response = await axios.post('http://127.0.0.1:5000/scrap-tally', payload, {})
                return response
            } catch(error) {
                throw error
            }
        },
        async updateScrap(payload) {
            try {
                const response = await axios.patch('http://127.0.0.1:5000/scrap-tally', payload, {})
                return response
            } catch(error) {
                throw error
            }
        },
        async deleteScrap(payload) {
            console.log(payload)
            try {
                const response = await axios.delete('http://127.0.0.1:5000/scrap-tally', {
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
