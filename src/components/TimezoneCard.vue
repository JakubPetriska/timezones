<template>
  <md-card>
    <md-card-header>
      <div id="timezone-time" class="md-title">{{ formattedTime }}</div>
    </md-card-header>
  
    <md-card-content id="timezone-name">{{ timezoneName }}</md-card-content>
  
    <md-button class="md-icon-button"
               @click.native="remove()"
               style="position: absolute; right: 0;">
      <md-icon>close</md-icon>
    </md-button>
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
      return this.adjustTimezone(this.time).format('h:mm:ss A')
    }
  },
  methods: {
    remove() {
      this.$emit('remove')
    },
    adjustTimezone(time) {
      return time.tz(this.timezoneKey)
    }
  }
}
</script>
