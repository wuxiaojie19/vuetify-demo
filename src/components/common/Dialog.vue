<script lang="ts" setup>

const emits = defineEmits(["confirm", "cancel"]);
const cancel = () => {
  emits("cancel");
}

const confirm = () => {
  emits("confirm");
}

</script>

<template>
  <div class="text-center pa-4">
    <v-dialog v-bind="$attrs">
      <v-card :prepend-icon="$attrs['prepend-icon'] as string" density="comfortable">
        <template #append>
          <v-btn icon="mdi-close" variant="text" @click="cancel"></v-btn>
        </template>
        <template #title>
          {{ $attrs.title }}
        </template>

        <v-card-text>
          <slot name="default"></slot>
        </v-card-text>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn @click="cancel">
            Disagree
          </v-btn>
          <v-btn @click="confirm">
            Agree
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
