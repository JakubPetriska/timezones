<template>
  <div id="app">
    <md-toolbar>
      <h1 class="md-title">Timezones</h1>
    </md-toolbar>
  
    <div class="main-content">
      <md-layout>
        <md-layout v-for="timezoneValue in shownTimezones"
                   :key="timezoneValue"
                   class="timezone-card-wrapper">
          <timezone-card :timezone-name="availableTimezones.get(timezoneValue).text"
                         :timezone-key="availableTimezones.get(timezoneValue).utc[0]"
                         v-on:remove="removeTimezone(timezoneValue)">
          </timezone-card>
        </md-layout>
      </md-layout>
    </div>
  
    <div class="add-button-wrapper">
      <md-button id="add-timezone"
                 class="md-icon-button md-raised md-accent"
                 @click.native="openDialog('add-dialog')">
        <md-icon>add</md-icon>
      </md-button>
    </div>
  
    <!-- Dialog that adds new timezone -->
    <md-dialog md-open-from="#add-timezone"
               md-close-to="#add-timezone"
               ref="add-dialog">
      <md-dialog-title>Add timezone</md-dialog-title>
  
      <md-dialog-content>
        <md-list>
          <md-list-item v-for="timezone in timezonesToAdd"
                        :key="timezone.value"
                        class="md-button"
                        @click.native="addTimezone(timezone); closeDialog('add-dialog')">
            <div class="md-list-text-container">
              <span>{{timezone.value}}</span>
              <span>{{timezone.text}}</span>
            </div>
          </md-list-item>
        </md-list>
      </md-dialog-content>
  
      <md-dialog-actions>
        <md-button class="md-primary"
                   @click.native="closeDialog('add-dialog')">Cancel</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import TimezoneCard from './components/TimezoneCard'
import timezonesjson from 'timezones.json'

export default {
  name: 'app',
  components: {
    TimezoneCard
  },
  data: function () {
    return {
      availableTimezones: new Map(),
      shownTimezones: []
    }
  },
  created: function () {
    let timezonesCount = timezonesjson.length
    for (let i = 0; i < timezonesCount; ++i) {
      let timezone = timezonesjson[i]
      if (timezone.utc && timezone.utc.length > 0) {
        // Omit timezones withou utc field, the utc field is used to identify the timezone
        // Timezones withou utc field are old and unused (nothing returned by googling of such timezones)
        // At the time of writing (10.4.2017) there were 2 such timezones
        this.availableTimezones.set(timezone.value, timezone)
      }
    }

    // TODO Restore shown timezones from local storage
    // TODO check that all timezones restored from local storage are available
  },
  computed: {
    timezonesToAdd() {
      return timezonesjson.filter(e => this.shownTimezones.indexOf(e.value) === -1)
    }
  },
  methods: {
    openDialog(ref) {
      this.$refs[ref].open()
    },
    closeDialog(ref) {
      this.$refs[ref].close()
    },
    addTimezone(timezone) {
      this.shownTimezones.push(timezone.value)
    },
    removeTimezone(timezoneValue) {
      this.shownTimezones.splice(this.shownTimezones.indexOf(timezoneValue), 1)
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
