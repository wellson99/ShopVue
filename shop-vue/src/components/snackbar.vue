<template>
  <v-snackbar v-model="showSnackbar" :timeout="snackbarTimeout" elevation="24" multi-line bottom text :color="snackbarColor">
    {{snackbarMessage}}
    <template v-slot:action="{ attrs }">
      <v-btn icon :color="snackbarColor" v-bind="attrs">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>

export default {
  name: "snackBar",
  props: ["show", "color", "message", "timeout"],
  computed:{
    showSnackbar: {
      get: function(){
        return this.show;
      },
      set: function(newValue){
        this.$emit('update:show', newValue)
      } 
    },
    snackbarColor: {
      get: function(){
        return this.color;
      },
      set: function(newValue){
        this.$emit('update:color', newValue)
      } 
    },
    snackbarMessage: {
      get: function(){
        return this.message;
      },
      set: function(newValue){
          this.$emit('update:message', newValue)
      } 
    },
    snackbarTimeout: {
      get: function(){
        return this.timeout;
      },
      set: function(newValue){
          this.$emit('update:timeout', newValue)
      } 
    },
  },
}
</script>