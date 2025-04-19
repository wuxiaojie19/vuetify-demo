<template>
  <div class="pt-5" style="height: 900px; width: 100%;">

    <div style="width: 400px; display: flex;text-align: start;" ref="msgArea">
      <v-alert v-model="alert" border="start" close-label="Close Alert" density="compact" type="error" title="Error"
        variant="tonal" closable>
        Aenean imperdiet. Quisque id odio. Cras dapibus. Pellentesque ut neque. Cras dapibus.

      </v-alert>
    </div>

    <div style="width: 400px; display: flex;text-align: start;">
      <v-alert density="compact" border="start" text="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        title="Alert title" type="success" closable></v-alert>
    </div>
    <div style="width: 400px; display: flex;text-align: start;">
      <v-alert density="compact" border="start" text="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        title="Alert title" type="error" closable></v-alert>
    </div>
    <div style="width: 400px; display: flex;text-align: start;">
      <v-alert density="compact" border="start" text="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        title="Alert title" type="warning" closable></v-alert>
    </div>
    <v-cart>
      <v-form validate-on="submit lazy" @submit.prevent="submit">
        <v-card-text>
          <v-sheet class="mx-auto  fill-height text-start text-no-wrap">
            <v-row align="start" justify="start">
              <v-col cols="12" md="1">
                <label class="mt-6">User Name</label>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="userName" :rules="rules" clearable></v-text-field>
              </v-col>
              <v-col cols="12" md="1">
                <label>User Name</label>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="userName" :rules="rules" readonly></v-text-field>
              </v-col><v-col cols="12" md="1">
                <label>User Name</label>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="userName" :rules="rules" disabled></v-text-field>
              </v-col>
            </v-row>
            <v-data-table v-column-resize2="headers"  density="comfortable" :headers="headers" :items="items" item-key="name">

            </v-data-table>
          </v-sheet>
        </v-card-text>
        <v-card-actions>
        </v-card-actions>
        <div class="mb-2" style="display: flex;">
          <v-spacer />
          <v-btn :loading="loading" class="mt-2" text="Submit" type="submit" color="primary"></v-btn>
          <v-spacer />
          <v-btn :loading="loading" class="mt-2" text="Link" append-icon="mdi-chevron-right" variant="plain"
            type="submit" color="primary"></v-btn>
          <v-spacer />
          <v-btn color="primary" variant="tonal">Open full report</v-btn>
          <v-spacer />
        </div>
        <v-btn class="mt-2" text="Submit" color="primary" @click="openDialog" />
      </v-form>

    </v-cart>

    <v-date-picker color="primary" />
  </div>
</template>

<script setup lang="ts">
import { useEventListener } from '@/utils/apptools'
import { renderDialog } from '@/utils/dialog'
import Login from '@/pages/comp/login.vue'

const openDialog = () => {
  const { unmount, instance } = renderDialog(Login, {}, {
    'max-width': 600,
    persistent: true,
    'prepend-icon': 'mdi-dock-top',
    title: 'Login',
  })
}

const move = () => {
  console.log('move')
}
const msgArea = useTemplateRef('msgArea')
console.log(msgArea)
const stop = useEventListener(msgArea, 'mousemove', move)
setTimeout(() => {
  stop()
}, 2000)

const alert = ref(true)
const headerProps = {
  // style: { backgroundColor: '#140a9a', color:'#FFF' }
}
const headers = [
  {
    title: 'Pyramid', value: 'name', key: 'Pyramid',

    removable: true,
    nowrap: true,
    minWidth: 200,
    maxWidth: 200,
    headerProps: {
      data: 'Pyramid',
    },
    cellProps: {
      data: 'Pyramid',
    },
  },
  {
    title: 'Location', value: 'location', key: 'location',

    removable: true,
    nowrap: true,
    minWidth: 200,
    maxWidth: 200,
    headerProps: {
      data: 'location',
    },
    cellProps: {
      data: 'location',
    },
  },
  { title: 'Construction Date', value: 'constructionDate' },
  {
    title: 'Dimensions1',
    align: 'center',
    children: [
      { title: 'Height(m)', value: 'height' },
      { title: 'Base(m)', value: 'base' },
      { title: 'Volume(m³)', value: 'volume' },
    ],
  },
  {
    title: 'Dimensions2',
    align: 'center',
    children: [
      { title: 'Height(m)', value: 'height' },
      { title: 'Base(m)', value: 'base' },
      { title: 'Volume(m³)', value: 'volume' },
    ],
  },
]

const items = [
  {
    name: 'Great Pyramid of Giza',
    location: 'Egypt',
    height: '146.6',
    base: '230.4',
    volume: '2583285',
    constructionDate: 'c. 2580–2560 BC',
  },
  {
    name: 'Pyramid of Khafre',
    location: 'Egypt',
    height: '136.4',
    base: '215.3',
    volume: '1477485',
    constructionDate: 'c. 2570 BC',
  },
  {
    name: 'Red Pyramid',
    location: 'Egypt',
    height: '104',
    base: '220',
    volume: '1602895',
    constructionDate: 'c. 2590 BC',
  },
  {
    name: 'Bent Pyramid',
    location: 'Egypt',
    height: '101.1',
    base: '188.6',
    volume: '1200690',
    constructionDate: 'c. 2600 BC',
  },
  {
    name: 'Pyramid of the Sun',
    location: 'Mexico',
    height: '65',
    base: '225',
    volume: '1237097',
    constructionDate: 'c. 200 CE',
  },
]



const rules = [value => checkApi(value)]

const loading = ref(false)
const userName = ref('')

async function submit(event) {
  loading.value = true
  const results = await event
  loading.value = false
  alert(JSON.stringify(results, null, 2))
}

let timeout = -1
async function checkApi(userName) {
  return new Promise(resolve => {
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      if (!userName) return resolve('Please enter a user name.')
      if (userName === 'johnleider') return resolve('User name already taken. Please try another one.')
      return resolve(true)
    }, 1000)
  })
}
</script>

<style>
</style>
