<template>
    <div class="relative">
        <div v-if="loading" class="text-center w-full">
            <label class="animate-pulse text-4xl">Loading...</label>
        </div>

        <div v-if="!loading">

            <Navbar @clear="clear()" @filterUser="user => { filterUser(user) }" @addScrap="modal = true" class="z-10"
                :users="users" />
            <ScrapTable @deleteScrap="(scrap) => { deleteScrap(scrap) }" @loadMore="loadMore()" :lastPage="lastPage"
                :loadingMore="loadingMore" @updateScrap="(scrap) => { updateScrap(scrap) }" :scraps="scraps"
                :loading="loadingTable" class="mt-10">
            </ScrapTable>
        </div>
        <div v-if="modal" class="absolute z-50 top-0  w-full flex flex-col items-center pr-10">
            <Form @updateTable="updateTable()" @closeModal="closeModal()" :selectedScrap="selectedScrap"
                :deleting="deleting" />
        </div>
    </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Form from '../components/Form.vue'
import ScrapTable from '../components/ScrapTable.vue'
import { gettersStore } from "../stores/getters.js"
export default {
    components: {
        Navbar,
        Form,
        ScrapTable
    },
    data() {
        return {
            users: [],
            processes: [],
            defectTypes: [],
            modal: false,
            loading: true,
            deleting: false,
            loadingTable: false,
            loadingMore: false,
            filteredUser: null,
            selectedScrap: {},
            page: 1,
            scraps: [],
            lastPage: true
        }
    },
    async beforeMount() {
        try {
            await gettersStore().getUsers();
            this.users = gettersStore()._users
            await gettersStore().getProcesses();
            await gettersStore().getDefectTypes();
            await gettersStore().getScrapTally({ page: this.page, userCode: this.filteredUser })
            this.scraps = gettersStore()._page
            this.lastPage = gettersStore()._lastPage
            console.log(this.scraps)
            this.loading = false
        } catch (error) {
            return error
        }
    },
    methods: {
        deleteScrap(scrap) {
            this.selectedScrap = scrap
            this.deleting = true
            this.modal = true
            console.log(scrap)
        },
        updateScrap(scrap) {
            this.selectedScrap = scrap
            this.modal = true
        },
        closeModal() {
            this.deleting = false
            this.modal = false
            this.selectedScrap = {}
        },
        async clear() {
            this.loadingTable = true
            this.filteredUser = null
            this.page = 1
            try {
                await gettersStore().getScrapTally({ page: this.page, userCode: this.filteredUser })
                this.scraps = gettersStore()._page
                this.lastPage = gettersStore()._lastPage
                console.log(gettersStore()._lastPage)
                this.loadingTable = false
            } catch (error) {
                this.filterUser(user)
            }
        },
        async loadMore() {
            this.loadingMore = true
            try {
                this.page = this.page + 1
                await gettersStore().getScrapTally({ page: this.page, userCode: this.filteredUser })
                this.scraps = this.scraps.concat(gettersStore()._page)
                this.lastPage = gettersStore()._lastPage
                this.loadingMore = false
            } catch (error) {
                this.updateTable()
            }
        },
        async updateTable() {
            console.log('amigoestoaqi')
            this.closeModal()
            this.loadingTable = true
            this.page = 1
            try {
                await gettersStore().getScrapTally({ page: this.page, userCode: this.filteredUser })
                this.scraps = gettersStore()._page
                this.lastPage = gettersStore()._lastPage
                this.loadingTable = false
            } catch (error) {
                this.updateTable()
            }
        },
        async filterUser(user) {
            this.loadingTable = true
            this.filteredUser = user
            this.page = 1
            try {
                await gettersStore().getScrapTally({ page: this.page, userCode: user })
                this.scraps = gettersStore()._page
                this.lastPage = gettersStore()._lastPage
                console.log(gettersStore()._lastPage)
                this.loadingTable = false
            } catch (error) {
                this.filterUser(user)
            }
        }
    }
}
</script>