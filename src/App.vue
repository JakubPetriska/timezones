<template>
  <div id="app">
    <md-toolbar>
      <h1 class="md-title">Timezones</h1>
    </md-toolbar>
  
    <div class="main-content">
      <md-layout>
        <md-layout v-for="timezone in timezones"
        class="timezone-card-wrapper">
          <timezone-card></timezone-card>
        </md-layout>
      </md-layout>
    </div>
  
    <div class="add-button-wrapper">
      <md-button class="md-icon-button md-raised md-accent"
                 @click.native="addTimezone">
        <md-icon>add</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
import TimezoneCard from './components/TimezoneCard'

export default {
  name: 'app',
  components: {
    TimezoneCard
  },
  data: function () {
    return {
      timezones: ['San Francisco', 'New York', 'Nein', 'Ja', '', '', '']
    }
  },
  methods: {
    addTimezone: function (event) {
      this.timezones.push('')
    }
  }
}
</script>

<style>
.main-content {
  padding: 8px;
}
.timezone-card-wrapper {
  margin: 8px;
}
.add-button-wrapper {
  position: fixed;
  right: 16px;
  bottom: 24px;
}
</style>
