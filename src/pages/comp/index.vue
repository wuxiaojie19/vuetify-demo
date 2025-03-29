<template>
  <div class="pt-5" style="height: 900px; width: 100%;">

    <div style="width: 400px; display: flex;text-align: start;">
      <v-alert v-model="alert" border="start" close-label="Close Alert" density="compact" type="error" title="Error"
        variant="tonal" closable>
        Aenean imperdiet. Quisque id odio. Cras dapibus. Pellentesque ut neque. Cras dapibus.

      </v-alert>
    </div>

    <div style="width: 400px; display: flex;text-align: start;">
      <v-alert density="compact" border="start"
        text="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        title="Alert title" type="success" closable></v-alert>
    </div>
    <div style="width: 400px; display: flex;text-align: start;">
      <v-alert density="compact" border="start"
        text="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        title="Alert title" type="error" closable></v-alert>
    </div>
    <div style="width: 400px; display: flex;text-align: start;">
      <v-alert density="compact" border="start"
        text="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        title="Alert title" type="warning" closable></v-alert>
    </div>
    <v-cart title="form test">
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
            <v-data-table density="comfortable" :headers="headers" :items="items" item-key="name"></v-data-table>
          </v-sheet>
        </v-card-text>
        <v-card-actions>
        </v-card-actions>
        <div class="mb-2" style="display: flex;">
          <v-spacer />
        <v-btn :loading="loading" class="mt-2" text="Submit" type="submit" color="primary"></v-btn>
        <v-spacer />
        <v-btn :loading="loading" class="mt-2" text="Link" append-icon="mdi-chevron-right" variant="plain" type="submit" color="primary" ></v-btn>
        <v-spacer />
        <v-btn color="primary" variant="tonal" >Open full report</v-btn>
        <v-spacer />
      </div>
        <v-data-table :items="items"></v-data-table>
        <v-btn :loading="loading" class="mt-2" text="Submit" type="submit" color="primary"></v-btn>
      </v-form>

    </v-cart>

    <v-date-picker color="primary" />
  </div>
</template>

<script setup lang="ts">
const alert = ref(true)
const headerProps = {
  // style: { backgroundColor: '#140a9a', color:'#FFF' }
}
const headers = [
  { title: 'Pyramid', value: 'name' },
  { title: 'Location', value: 'location' },
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
.v-table .v-table__wrapper>table>thead>tr>th {
  border-bottom: 1px solid #afafaf !important;
  background-color: #efeff7;
}

/* .v-data-table .v-data-table__th {
  background-color: #e8ebff;
} */
/* 主色调定义 */
:root {
  --primary-color: #140a9a;
  --primary-light: #e8ebff;
  --primary-lighter: #f5f7ff;
}

/* 表格整体样式 */
.custom-data-table {
  border: 1px solid rgba(20, 10, 154, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

/* 表头样式 */
.custom-header {
  background-color: var(--primary-color) !important;
}

.custom-header th {
  color: white !important;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

/* 行样式 */
.custom-data-table .custom-row:nth-child(even) {
  background-color: var(--primary-lighter);
}

/* 悬停效果 */
.custom-data-table .custom-row:hover {
  background-color: var(--primary-light) !important;
  transition: background-color 0.2s;
}

/* 边框和分割线 */
.custom-data-table td,
.custom-data-table th {
  border-right: 1px solid #e0e0ff;
}

.custom-data-table td:last-child,
.custom-data-table th:last-child {
  border-right: none;
}

/* 分页器样式 */
.custom-data-table .v-data-table-footer {
  border-top: 1px solid #e0e0ff;
}
</style>
