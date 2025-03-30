<script setup lang="ts">
import { shallowRef, watch } from 'vue'

const dialog = shallowRef(false)
watch(dialog, val => {
  if (!val) return
  setTimeout(() => (dialog.value = false), 4000)
})
</script>
<template>
  <div class="pa-4 text-center">
    <v-btn :disabled="dialog" color="primary" icon="mdi-refresh" text="Start loading" @click="dialog = true"></v-btn>

    <v-dialog v-model="dialog" max-width="160" persistent>
      <v-list class="py-2" color="primary" elevation="8" rounded="rounded">
        <v-list-item title="Loading...">
          <template v-slot:prepend>
            <div class="pe-4">
              <v-img :width="20" aspect-ratio="1/1" cover src="@/assets/ODLS.png"></v-img>
            </div>
          </template>

          <template v-slot:append>
            <v-progress-circular color="primary" indeterminate="disable-shrink" size="16"
              width="2"></v-progress-circular>
          </template>
        </v-list-item>
      </v-list>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
