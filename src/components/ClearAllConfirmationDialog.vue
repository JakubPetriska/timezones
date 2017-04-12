<template>
  <md-dialog>
    <md-dialog-title>Clear</md-dialog-title>
    <md-dialog-content>
      Do you really want to clear all shown timezones?
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary"
                 @click.native="close()">Cancel</md-button>
      <md-button class="md-primary"
                 @click.native="confirm(); close()">Clear all</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
export default {
  name: 'clear-all-confirmation-dialog',
  methods: {
    close() {
      // First and only child is the dialog element
      this.$children[0].close()
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>
