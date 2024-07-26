<template>
    <div class="w-full flex gap-40 items-center">
        <div>
            <label>Operator:</label>
            <div class="flex gap-4 items-center">
                <Combobox :options="users" v-model="selectedOption" />
                <button @click="$emit('clear')" class="w-5 h-5 bg-white"></button>
            </div>


        </div>

        <button @click="$emit('addScrap')" class="bg-white rounded w-48 text-grey font-bold h-8">
            <label class="cursor-pointer">Add Scrap</label>
        </button>
    </div>
</template>

<script>
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
            selectedOption: {}
        }
    },
    watch: {
        selectedOption: {
            handler() {
                this.$emit('filterUser', this.selectedOption.id);
            },
            deep: true
        },
    }
}
</script>