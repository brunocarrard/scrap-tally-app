<template>
    <div class="w-full flex gap-40 items-center">
        <div>
            <label>Operator:</label>
            <div class="flex gap-4 items-center">
                <Combobox :options="users" v-model="selectedOption" />
                <button @click="clear()" class="w-6 h-5 bg-white flex items-center justify-center rounded-full"><i
                        class="cursor-pointer" v-html="eraseIcon"></i></button>
            </div>


        </div>

        <button @click="$emit('addScrap')" class="bg-white rounded w-48 text-grey font-bold h-8">
            <label class="cursor-pointer">Add Scrap</label>
        </button>
    </div>
</template>

<script>
import { eraseIcon } from '../assets/index.js';
import Combobox from './Combobox.vue'
export default {
    props: {
        users: Array
    },
    components: {
        Combobox
    },
    data() {
        return {
            selectedOption: {},
            eraseIcon
        }
    },
    watch: {
        selectedOption: {
            handler() {
                this.$emit('filterUser', this.selectedOption.id);
            },
            deep: true
        }
    },
    methods: {
        clear() {
            this.$emit('clear');
            this.selectedOption = {}
        }
    }
}
</script>