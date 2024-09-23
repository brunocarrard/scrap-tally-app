import { defineStore } from "pinia";
import axios from "axios";
import { useToastify } from 'vue-toastify-3'
const { toastify } = useToastify()


export const gettersStore = defineStore("getters", {
    state: () => ({
        _users: [],
        _processes: [],
        _defectTypes: [],
        _machines: [],
        _defectConditions: [],
        _defectTypes: [],
        _parts: [],
        _rawMaterials: [],
        _page: [],
        _identities: [],
        _lastPage: false
      }),
    actions: {
        async getUsers() {
            try {
                const response = await axios.get('https://192.168.0.154:4040/users');
                this.$patch({ _users: response.data })
                return response
            } catch (error) {
                if (error.response.status == '401') {
                    try {
                        throw error
                    } catch (error2) {
                        throw error2
                    }
                } else {
                throw error
                }
            }
        },
        async getProcesses() {
            try {
                const response = await axios.get('https://192.168.0.154:4040/processes');
                this.$patch({ _processes: response.data })
                return response
            } catch (error) {
                if (error.response.status == '401') {
                    try {
                        throw error
                    } catch (error2) {
                        throw error2
                    }
                } else {
                throw error
                }
            }
        },
        async getDefectTypes() {
            try {
                const response = await axios.get('https://192.168.0.154:4040/defect-types');

                this.$patch({ _defectTypes: response.data })
                return response
            } catch (error) {
                if (error.response.status == '401') {
                    try {
                        throw error
                    } catch (error2) {
                        throw error2
                    }
                } else {
                throw error
                }
            }
        },
        async getMachines(payload) {
            try {
                const response = await axios.get('https://192.168.0.154:4040/machines', {
                    params: {
                        process: payload
                    }
                });
                this.$patch({ _machines: response.data })
                return response
            } catch (error) {
                if (error.response.status == '401') {
                    try {
                        throw error
                    } catch (error2) {
                        throw error2
                    }
                } else {
                throw error
                }
            }
        },
        async getDefectsConditions(payload) {
            try {
                const response = await axios.get('https://192.168.0.154:4040/defect-conditions', {
                    params: {
                        'process': payload.process,
                        'defect-type': payload.defectType
                    }
                });
                this.$patch({ _defectConditions: response.data })
                return response
            } catch (error) {
                if (error.response.status == '401') {
                    try {
                        throw error
                    } catch (error2) {
                        throw error2
                    }
                } else {
                throw error
                }
            }
        },
        async getDefectTypes() {
            try {
                const response = await axios.get('https://192.168.0.154:4040/defect-types');
                this.$patch({ _defectTypes: response.data })
                return response
            } catch (error) {
                if (error.response.status == '401') {
                    try {
                        throw error
                    } catch (error2) {
                        throw error2
                    }
                } else {
                throw error
                }
            }
        },
        async getParts(payload) {
            try {
                const response = await axios.get('https://192.168.0.154:4040/parts', {
                    params: {
                        process: payload
                    }
                });
                this.$patch({ _parts: response.data })
                return response
            } catch (error) {
                throw error
            }
        },
        async getRawMaterials(payload) {
            try {
                const response = await axios.get('https://192.168.0.154:4040/raw-materials', {
                    params: {
                        producedPart: payload
                    }
                });
                this.$patch({ _rawMaterials: response.data })
                return response
            } catch (error) {
                throw error
            }
        },
        async getIdentities(payload) {
            try {
                const response = await axios.get('https://192.168.0.154:4040/part-identity', {
                    params: {
                        part: payload
                    }
                });
                this.$patch({ _identities: response.data })
                return response
            } catch (error) {
                throw error
            }
        },
        async getScrapTally(payload) {
            try {
                const response = await axios.get('https://192.168.0.154:4040/scrap-tally', {
                    params: {
                        page: payload.page,
                        user_code: payload.userCode
                    }
                });
                this.$patch({ _page: response.data.page })
                this.$patch({ _lastPage: response.data.last_page })
                return response
            } catch (error) {
                if (error.response.status == '401') {
                    try {
                        throw error
                    } catch (error2) {
                        throw error2
                    }
                } else {
                throw error
                }
            }
        }
    }
});
// https://192.168.0.154:4040