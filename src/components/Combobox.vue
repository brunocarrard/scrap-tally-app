<template>
    <div :class="{ 'combobox': true, 'border-red-500': modelValue.description != searchTerm, 'border': true }">
        <input type="text" v-model="searchTerm" @input="onInput" placeholder="Search..."
            class="combobox-input bg-white" />
        <ul v-if="filteredOptions.length" class="combobox-list">
            <li v-for="option in filteredOptions" :key="option.id" @click="selectOption(option)" class="combobox-item">
                <!-- {{ searchById ? `${option.id} // ${option.description}` : option.description }} -->
                {{ option.description }}
            </li>
        </ul>
        <p class="absolute z-0 text-sm text-red-500" v-if="modelValue.description != searchTerm">Must choose a valid
            option.</p>
    </div>
</template>

<script>
export default {
    name: "SearchableCombobox",
    props: {
        options: {
            type: Array,
            required: true,
        },
        modelValue: Object,
        searchById: Boolean
    },
    data() {
        return {
            searchTerm: this.modelValue.description,
            filteredOptions: [],
        };
    },
    watch: {
        modelValue(newValue) {
            if (typeof newValue.description === '') this.searchTerm = this.options.find(option => { option.id == newValue.id }).description
            this.searchTerm = newValue.description;
        },
    },
    methods: {
        onInput() {
            this.filteredOptions = this.options.filter((option) =>
                this.searchById ? option.description.toLowerCase().includes(this.searchTerm.toLowerCase()) || option.id.toLowerCase().includes(this.searchTerm.toLowerCase()) : option.description.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
            this.$emit("update:modelValue", this.modelValue);
        },
        selectOption(option) {
            this.searchTerm = option.description;
            this.$emit("update:modelValue", option);
            this.filteredOptions = [];
        },
    },
};
</script>

<style scoped>
.combobox {
    position: relative;
    width: 208px;
}

.combobox-input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    background: #716e6e
}

.combobox-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
    list-style: none;
    padding: 0;
    margin: 0;
}

.combobox-item {
    padding: 8px;
    cursor: pointer;
    background: #716e6e;
}

.combobox-item:hover {
    background: #716e6e;
}
</style>