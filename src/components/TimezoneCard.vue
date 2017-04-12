<template>
  <md-card>
    <md-card-header>
      <div class="md-title">{{ formattedTime }}</div>
    </md-card-header>
  
    <md-card-content>{{ timezoneName }}</md-card-content>
  
    <md-button @click.native="remove()">Remove</md-button>
  </md-card>
</template>

<script>
import momenttz from 'moment-timezone'

export default {
  name: 'timezone-card',
  props: ['timezoneName', 'timezoneKey'],
  data: function () {
    return {
      time: momenttz()
    }
  },
  created: function () {
    setInterval(() => { this.time = momenttz() }, 1000)
  },
  computed: {
    formattedTime() {
      return this.time.tz(this.timezoneKey).format('h:mm:ss A')
    }
  },
  methods: {
    remove() {
      this.$emit('remove')
    }
  }
}
</script>
