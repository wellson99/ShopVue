<template>
  <v-row class="mx-2 align-center">
    <v-col >
      <span class="text-h5 font-weight-medium">{{title}}</span>
      <br class="mb-1">
      <span class="text-body-1 grey--text text--darken-2">{{description}}</span>
      <v-divider class="mt-3"/>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "pageHeader",
  props: {
    title: {type: String, required: true},
    description: {type: String, required: true}
  }
}
</script>