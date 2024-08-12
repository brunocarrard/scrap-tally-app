<template>
    <div class="self-center text-xs sm:text-base items-center gap-4">
        <div v-if="loading" class="text-center w-full">
            <label class="animate-pulse text-2xl text-white">Loading Table...</label>
        </div>
        <div v-if="scraps.length == 0 && !loading" class="text-center w-full">
            <label class="text-2xl text-white">No scraps found.</label>
        </div>
        <table v-if="!loading && scraps.length > 0" class="bg-white w-1/4 sm:w-1/2">
            <thead class="header">
                <tr class="grid grid-cols-12">
                    <th class="col-span-1">Date</th>
                    <th class="col-span-1">Operator</th>
                    <th class="col-span-1">Process</th>
                    <th class="col-span-1">Machine</th>
                    <th class="col-span-1">Produced Part</th>
                    <th class="col-span-1">Raw Material</th>
                    <th class="col-span-1">Qty</th>
                    <th class="col-span-1">Defect Type</th>
                    <th class="col-span-1">Defect Condition</th>
                    <th class="col-span-2">Comment</th>
                    <th class="col-span-1 flex items-center justify-center">Options</th>
                </tr>
            </thead>
            <tbody class="flex flex-col  auto">
                <tr v-for=" scrap in scraps " class="grid grid-cols-12 transition-transform">
                    <td class="col-span-1 "> {{ formatDate(scrap.date) }} </td>
                    <td class="col-span-1 "> {{ scrap.operator.description }} </td>
                    <td class="col-span-1 "> {{ scrap.process.description }} </td>
                    <td class="col-span-1 "> {{ scrap.machine.description }} </td>
                    <td
                        class="col-span-1 overflow-hidden whitespace-nowrap text-ellipsis hover:text-wrap hover:text-clip">
                        {{
                            scrap.producedPart.id }} / {{
                            scrap.producedPart.description }}
                    </td>
                    <td
                        class="col-span-1 overflow-hidden whitespace-nowrap text-ellipsis hover:text-wrap hover:text-clip">
                        {{
                            scrap.rawMaterial.id }} / {{
                            scrap.rawMaterial.description }}
                    </td>
                    <td class="col-span-1 "> {{ scrap.qty }} </td>
                    <td
                        class="col-span-1 overflow-hidden whitespace-nowrap text-ellipsis hover:text-wrap hover:text-clip">
                        {{
                            scrap.defectType.description }} </td>
                    <td
                        class="col-span-1 overflow-hidden whitespace-nowrap text-ellipsis hover:text-wrap hover:text-clip">
                        {{
                            scrap.defectCondition.description }} </td>
                    <td
                        class="col-span-2 overflow-hidden whitespace-nowrap text-ellipsis hover:text-wrap hover:text-clip">
                        {{
                            scrap.comment }} </td>
                    <td class="col-span-1 flex items-center justify-around">
                        <i class="cursor-pointer" v-html="updateIcon" @click="$emit('updateScrap', scrap)"
                            v-if="!scrap.processed"></i>
                        <i v-html="dUpdateIcon" v-if="scrap.processed"></i>
                        <i class="cursor-pointer" v-html="litterBox" @click="$emit('deleteScrap', scrap)"
                            v-if="!scrap.processed"></i>
                        <i v-html="dLitterBox" v-if="scrap.processed"></i>
                    </td>
                </tr>
            </tbody>
        </table>
        <button @click="$emit('loadMore')" :disabled="loadingMore" v-if="!lastPage && !loading"
            class="bg-white rounded w-48 text-grey font-bold h-8">
            <label v-if="!loadingMore" class="cursor-pointer">Load more</label>
            <label v-if="loadingMore" class="animate-pulse">Loading...</label>
        </button>
    </div>
</template>

<script>
import { litterBox } from '../assets/index.js';
import { updateIcon } from '../assets/index.js';
import { dLitterBox } from '../assets/index.js';
import { dUpdateIcon } from '../assets/index.js';
export default {
    props: {
        loading: Boolean,
        scraps: Array,
        lastPage: Boolean,
        loadingMore: Boolean
    },
    data() {
        return {
            litterBox,
            updateIcon,
            dLitterBox,
            dUpdateIcon
        }
    },
    methods: {
        formatDate(date) {
            // Ensure the date is a Date object
            const dateObj = new Date(date);

            // Check if the date is valid
            if (isNaN(dateObj)) {
                return 'Invalid Date';
            }

            // Format the date as MM/DD/YYYY
            return dateObj.toLocaleDateString('en-US');
        }
    }
}
</script>

<style scoped>
div {
    display: flex;
    flex-direction: column;
    color: black
}

table {
    border-collapse: collapse;
    width: 100%;
}

table,
th,
td {
    border: 1px solid #000;
    font-size: 12px;
}

th,
td {
    padding: 10px;
    text-align: left;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    border-bottom: 1px solid #999;
}

th {
    background: linear-gradient(to right, #adbac0 0%, #dfe0e1 20%, #f2f2f2 50%, #dfe0e1 80%, #b5c1c6 100%);
    overflow-x: hidden;
}

td {
    background-color: #f2f2f2
}
</style>