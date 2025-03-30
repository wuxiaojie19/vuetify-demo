<script setup lang="ts">
const form = useTemplateRef('form')
const firstName = ref('')
const firstNameRules = [
  value => {
    if (value?.length >= 3) return true
    return 'First name must be at least 3 characters.'
  },
]

const lastName = ref('123')
const lastNameRules = [
  value => {
    if (/[^0-9]/.test(value)) return true
    return 'Last name can not contain digits.'
  },
]


const postData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('submit')
      resolve({ result: true })
    }, 1500)
  })
}

const submit = async () => {
  console.log(form)
  const result = await form.value?.validate()
  console.log(result)
  if (!result.valid) {
    return
  }
  return await postData()
}
defineExpose({
  submit
})
</script>
<template>
  <v-sheet class="mx-auto" width="300">
    <v-form @submit.prevent="submit" ref="form">
      <v-text-field v-model="firstName" :rules="firstNameRules" label="First name"></v-text-field>

      <v-text-field v-model="lastName" :rules="lastNameRules" label="Last name"></v-text-field>

      <v-btn class="mt-2" type="submit" block>Submit</v-btn>
    </v-form>
  </v-sheet>
</template>
