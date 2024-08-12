<template>
  <div v-if="deleting" class="w-1/4 py-6 bg-black px-4 rounded-xl   border-4 border-red-500">
    <label>You sure you want to delete scrap?</label>
    <div class="flex gap-4">

      <button :disabled="posting" @click="deleteScrap()" class="bg-white rounded w-1/2 mt-5 text-grey font-bold h-8">
        <label class="cursor-pointer">Yes</label>
      </button>
      <button :disabled="posting" @click="$emit('closeModal')"
        class="bg-white rounded w-1/2 mt-5 text-grey font-bold h-8">
        <label class="cursor-pointer">No</label>
      </button>
    </div>
  </div>
  <div v-if="!deleting" class="w-1/4 py-6 bg-black px-4 rounded-xl   border-4 border-red-500 ">
    <i v-html="closeIcon" class="absolute top-0 left-1/2 pl-24 pt-6 cursor-pointer" @click="$emit('closeModal')"></i>
    <div v-if="loading">
      <label class="animate-pulse text-4xl">Loading...</label>
    </div>
    <div v-if="!loading" class="flex flex-col items-center justify-center gap-4">
      <h2 class="text-white font-bold w-52">Insert new Scrap</h2>
      <div class="flex flex-col gap-2">
        <label>Select Operator:</label>
        <Combobox :options="users" v-model="selectedUser" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Select Process:</label>
        <Combobox :options="processes" v-model="selectedProcess" />
      </div>
      <div v-if="machines.length > 0" class="flex flex-col gap-2">
        <label>Select Machine:</label>
        <Combobox :options="machines" v-model="selectedMachine" />
      </div>
      <div v-if="producedParts.length > 0" class="flex flex-col gap-2">
        <label>Select Produced Part:</label>
        <Combobox :options="producedParts" v-model="selectedProducedPart" />
      </div>
      <div v-if="rawMaterials.length > 0" class="flex flex-col gap-2">
        <label>Select Raw Material:</label>
        <Combobox :options="rawMaterials" v-model="selectedRawMaterial" />
      </div>
      <!-- <div class="flex gap-2 w-52">

        <label>Full Sheet?</label>
        <div class="flex gap-1">
          <input type="checkbox" v-model="fullSheet" />
          <label v-if="fullSheet">Yes</label>
          <label v-if="!fullSheet">No</label>
        </div>
      </div> -->
      <div class="flex gap-2
      w-52">
        <label>Qty:</label>
        <input type="number" v-model="qty" class="w-20" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Defect Type:</label>
        <Combobox :options="defectTypes" v-model="selectedDefectType" />
      </div>
      <div v-if="defectConditions.length > 0" class="flex flex-col gap-2">
        <label>Defect:</label>
        <Combobox :options="defectConditions" v-model="selectedDefectCondition" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Comment:</label>
        <textarea v-model="comment" class="w-52" rows="4" />
      </div>
      <button @click="postScrap" :disabled="posting" v-if="isFilled"
        class="bg-white rounded w-52 mt-5 text-grey font-bold h-8">
        <label v-if="!posting" class="cursor-pointer">Confirm</label>
        <label v-if="posting" class="animate-pulse">Posting...</label>
      </button>
    </div>
  </div>
</template>

<script>
import Combobox from './Combobox.vue'
import { gettersStore } from "../stores/getters.js"
import { scrapTallyStore } from "../stores/scrapTally.js"
import { closeIcon } from '../assets/index.js';
import { useToastify } from 'vue-toastify-3'
const { toastify } = useToastify()
export default {
  props: {
    selectedScrap: Object,
    deleting: Boolean
  },
  components: {
    Combobox
  },
  data() {
    return {
      disabled: false,
      loading: true,
      posting: false,
      closeIcon,
      comment: '',
      users: [],
      processes: [],
      machines: [],
      defectTypes: [],
      defectConditions: [],
      producedParts: [],
      rawMaterials: [],
      qty: 0,
      selectedUser: {},
      selectedProcess: {},
      selectedMachine: {},
      selectedDefectType: {},
      selectedDefectCondition: {},
      selectedProducedPart: {},
      selectedRawMaterial: {},
      fullSheet: false
    }
  },
  async mounted() {
    this.users = gettersStore()._users
    this.processes = gettersStore()._processes
    const originDefectTypes = gettersStore()._defectTypes
    originDefectTypes.forEach((type, index) => {
      this.defectTypes.push({
        id: index,
        description: type
      })
    })
    if (!(Object.keys(this.selectedScrap).length === 0)) {
      try {
        await this.initializeOptions()
      } finally {
        this.selectedUser = this.selectedScrap.operator
        this.selectedProcess = this.selectedScrap.process
        this.selectedMachine = this.selectedScrap.machine
        this.selectedDefectType = this.selectedScrap.defectType
        this.selectedDefectCondition = this.selectedScrap.defectCondition
        this.selectedProducedPart = this.selectedScrap.producedPart
        this.selectedRawMaterial = this.selectedScrap.rawMaterial
        this.qty = this.selectedScrap.qty
        this.comment = this.selectedScrap.comment
      }
    }
    this.loading = false
  },
  emits: ['closeModal', 'updateTable'],
  computed: {
    machinesProcessWatcher() {
      return {
        process: this.selectedProcess,
        defectType: this.selectedDefectType
      };
    },
    isFilled() {
      if (!(Object.keys(this.selectedUser).length === 0) &&
        !(Object.keys(this.selectedProcess).length === 0) &&
        !(Object.keys(this.selectedMachine).length === 0) &&
        !(Object.keys(this.selectedDefectType).length === 0) &&
        !(Object.keys(this.selectedDefectCondition).length === 0) &&
        !(Object.keys(this.selectedProducedPart).length === 0) &&
        !(Object.keys(this.selectedRawMaterial).length === 0) &&
        this.qty > 0) return true
      else return false
    }
  },
  watch: {
    selectedProcess: {
      handler(newVal, oldVal) {
        this.getMachinesAndParts(newVal.id);
      },
      deep: true
    },
    machinesProcessWatcher: {
      handler(newVal, oldVal) {
        if (!(Object.keys(this.selectedProcess).length === 0) && !(Object.keys(this.selectedDefectType).length === 0)) {
          this.getDefectConditions(this.selectedProcess, this.selectedDefectType);
        }
      },
      deep: true
    },
    selectedProducedPart: {
      handler(newVal, oldVal) {
        this.getRawMaterials(newVal.id)
      }
    }
  },
  methods: {
    async getMachinesAndParts(payload) {
      await gettersStore().getMachines(payload);
      this.machines = gettersStore()._machines
      if ((Object.keys(this.selectedScrap).length === 0)) this.selectedMachine = {}
      try {
        await gettersStore().getParts(payload);
        this.producedParts = gettersStore()._parts
      } catch (error) {
        toastify('error', error.response.data.error)
      }

    },
    async getRawMaterials(payload) {
      try {
        await gettersStore().getRawMaterials(payload)
        this.rawMaterials = gettersStore()._rawMaterials
      } catch (error) {
        toastify('error', error.response.data.error)
      }
    },
    async getDefectConditions(process, defectType) {
      const payload = {
        process: process.id,
        defectType: defectType.description
      }
      await gettersStore().getDefectsConditions(payload);
      this.defectConditions = gettersStore()._defectConditions
    },
    async initializeOptions() {
      await gettersStore().getMachines(this.selectedScrap.process.id);
      this.machines = gettersStore()._machines
      try {
        await gettersStore().getParts(this.selectedScrap.process.id);
        this.producedParts = gettersStore()._parts
      } catch (error) {
        this.producedParts = [this.selectedScrap.producedPart]
      }
      try {
        await gettersStore().getRawMaterials(this.selectedScrap.producedPart.id)
        this.rawMaterials = gettersStore()._rawMaterials
      } catch (error) {
        this.rawMaterials = [this.selectedScrap.rawMaterial]
      }
      const payload = {
        process: this.selectedScrap.process.id,
        defectType: this.selectedScrap.defectType.description
      }
      await gettersStore().getDefectsConditions(payload);
      this.defectConditions = gettersStore()._defectConditions
    },
    async deleteScrap() {
      this.posting = true
      const payload = {
        scrapTally: this.selectedScrap.scrapTally,
        user: this.selectedScrap.operator.id
      }
      try {
        let response = await scrapTallyStore().deleteScrap(payload)
        toastify('success', response.data)
        this.$emit('updateTable')
      } catch (error) {
        toastify('error', 'Scrap delete failed, please try again.')
      } finally {
        this.posting = false
      }
    },
    async postScrap() {
      this.posting = true
      const payload = {
        machCode: this.selectedMachine.id,
        producedPart: this.selectedProducedPart.id,
        rawMaterial: this.selectedRawMaterial.id,
        machGrpCode: this.selectedProcess.id,
        qty: this.qty,
        defectCondition: this.selectedDefectCondition.description,
        defectType: this.selectedDefectType.description,
        comment: this.comment,
        user: this.selectedUser.id
      }
      if (!(Object.keys(this.selectedScrap).length === 0)) {
        payload.scrapTally = this.selectedScrap.scrapTally
        try {
          let response = await scrapTallyStore().updateScrap(payload)
          toastify('success', response.data)
          this.$emit('updateTable')
        } catch (error) {
          toastify('error', 'Scrap update failed, please try again.')
        } finally {
          this.posting = false
        }
      } else {
        try {
          let response = await scrapTallyStore().postScrap(payload)
          toastify('success', response.data)
          this.$emit('updateTable')
        } catch (error) {
          toastify('error', 'Scrap insert failed, please try again.')
        } finally {
          this.posting = false
        }
      }
    }
  }
}
</script>
