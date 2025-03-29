<template>
  <div>123
    <h1>{{ $t('$vuetify.label.compName') }}</h1>
    <v-btn color="primary" @click="changeLocale('en')">
      EN
    </v-btn>
    <v-btn color="primary" @click="changeLocale('zhHans')">
      ZH
    </v-btn>
  </div>
</template>

<script lang="ts" setup>

import { useLocale } from 'vuetify'
const { current } = useLocale()
const changeLocale = (locale: string) => {
  current.value = locale
}
</script>