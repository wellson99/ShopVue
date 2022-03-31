<template>
  <v-dialog v-model="showDialog" persistent width="380">
    <v-card class="pa-0">
      <v-card-text>
        <v-row>
          <v-col class="align-center justify-center text-center mt-10"> 
            <v-progress-circular indeterminate :width="8" :size="80" color="primary"/>
            <p class="text-body-1 grey--text text--darken-2 mt-8">{{dialogMessage}}</p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "loadingDialog",
  props: ["show", "message"],
  computed: {
    showDialog:{
      get: function(){
        return this.show;
      },
      set: function(newValue){
        this.$emit('update:show', newValue)
      } 
    },
    dialogMessage:{
      get: function(){
        return this.message;
      },
      set: function(newValue){
        this.$emit('update:message', newValue)
      } 
    },
  },
}
</script>