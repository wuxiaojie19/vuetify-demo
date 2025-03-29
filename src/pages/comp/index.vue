<template>
  <div class="pt-5" style="height: 900px; width: 100%;">
    <v-cart title="form test">
      <v-form validate-on="submit lazy" @submit.prevent="submit">
        <v-card-text>
          <v-sheet class="mx-auto  fill-height text-start text-no-wrap">
            <v-row align="start" justify="start">
              <v-col cols="12" md="1">
                <label class="mt-6">User Name</label>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-model="userName" :rules="rules" clearable ></v-text-field>
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

            <v-data-table :items="items" :header-props="headerProps"  density="comfortable"></v-data-table>
          </v-sheet>
        </v-card-text>
        <v-card-actions>
        </v-card-actions>
        <v-btn :loading="loading" class="mt-2" text="Submit" type="submit" color="primary"></v-btn>
      </v-form>
    </v-cart>

    <v-date-picker color="secondary" />
  </div>
</template>

<script setup lang="ts">

const headerProps = {
  style: { backgroundColor: '#140a9a', color:'#FFF' }
}
const items = [
    {
      name: 'African Elephant',
      species: 'Loxodonta africana',
      diet: 'Herbivore',
      habitat: 'Savanna, Forests',
    },
    {
      name: 'African Elephant',
      species: 'Loxodonta africana',
      diet: 'Herbivore',
      habitat: 'Savanna, Forests',
    },
    {
      name: 'African Elephant',
      species: 'Loxodonta africana',
      diet: 'Herbivore',
      habitat: 'Savanna, Forests',
    },
    {
      name: 'African Elephant',
      species: 'Loxodonta africana',
      diet: 'Herbivore',
      habitat: 'Savanna, Forests',
    },
    // ... more items
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

<style scoped>

</style>
