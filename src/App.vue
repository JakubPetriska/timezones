<template>
  <div id="app">
    <md-toolbar>
      <h1 class="md-title"
          style="flex: 1">Timezones</h1>
  
      <md-button id="clear"
                 class="md-icon-button"
                 @click.native="openDialog('clear-confirmation-dialog')">
        <md-icon>clear_all</md-icon>
      </md-button>
  
      <md-button id="add-timezone"
                 class="md-icon-button"
                 @click.native="openDialog('add-dialog')">
        <md-icon>add</md-icon>
      </md-button>
    </md-toolbar>
  
    <div class="main-content">
      <md-layout>
        <md-layout v-for="timezoneValue in shownTimezones"
                   :key="timezoneValue"
                   class="timezone-card-wrapper">
          <timezone-card :timezone-name="availableTimezones.get(timezoneValue).text"
                         :timezone-key="availableTimezones.get(timezoneValue).utc[0]"
                         v-on:remove="removeTimezone(timezoneValue)"
                         class="md-flex">
          </timezone-card>
        </md-layout>
      </md-layout>
    </div>
  
    <!-- Dialog that confirms clearing of all timezones -->
    <md-dialog md-open-from="#clear"
               md-close-to="#clear"
               ref="clear-confirmation-dialog">
      <md-dialog-title>Clear</md-dialog-title>
  
      <md-dialog-content>
        Do you really want to clear all shown timezones?
      </md-dialog-content>
  
      <md-dialog-actions>
        <md-button class="md-primary"
                   @click.native="closeDialog('clear-confirmation-dialog')">Cancel</md-button>
        <md-button class="md-primary"
                   @click.native="clearAll(); closeDialog('clear-confirmation-dialog')">Confirm</md-button>
      </md-dialog-actions>
    </md-dialog>
  
    <!-- Dialog that adds new timezone -->
    <md-dialog md-open-from="#add-timezone"
               md-close-to="#add-timezone"
               ref="add-dialog"
               v-on:close="clearSearchQuery()">
      <md-dialog-title>
        <span>Add timezone</span>
        <md-input-container style="padding-bottom:0">
          <md-input v-model="addTimezoneSearchQuery"
                    placeholder="Search for timezone name, city, state or offset"></md-input>
        </md-input-container>
      </md-dialog-title>
  
      <md-dialog-content class="add-timezone-dialog-content">
        <md-list>
          <md-list-item v-for="timezone in searchedTimezones"
                        :key="timezone.value"
                        class="timezones-list-item"
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
      shownTimezones: [],
      addTimezoneSearchQuery: ''
    }
  },
  created: function () {
    for (let i = 0; i < timezonesjson.length; ++i) {
      let timezone = timezonesjson[i]
      if (timezone.utc && timezone.utc.length > 0) {
        // Omit timezones withou utc field, the utc field is used to identify the timezone
        // Timezones withou utc field are old and unused (nothing returned by googling of such timezones)
        // At the time of writing (10.4.2017) there were 2 such timezones
        this.availableTimezones.set(timezone.value, timezone)
      }
    }

    if (typeof (Storage) !== 'undefined' && localStorage.shownTimezones) {
      // Browser supports localStorage and shownTimezones are stored
      // Make sure all stored timezones are contained in available timezones, otherwise drop them
      let storedTimezones = JSON.parse(localStorage.shownTimezones)
      for (let i = 0; i < storedTimezones.length; ++i) {
        let storedTimezoneValue = storedTimezones[i]
        if (this.availableTimezones.has(storedTimezoneValue)) {
          this.shownTimezones.push(storedTimezoneValue)
        }
      }
    }
  },
  computed: {
    notAddedTimezones() {
      return timezonesjson.filter(e => this.shownTimezones.indexOf(e.value) === -1)
    },
    searchedTimezones() {
      if (!this.addTimezoneSearchQuery) {
        return this.notAddedTimezones
      } else {
        return this.notAddedTimezones
          .map(timezone => {
            return {
              score: this.scoreTimezone(timezone, this.addTimezoneSearchQuery),
              timezoneObject: timezone
            }
          })
          .filter(timezoneWrapper => timezoneWrapper.score > 0)
          .sort((left, right) => left.score - right.score)
          .map(timezoneWrapper => timezoneWrapper.timezoneObject)
      }
    }
  },
  methods: {
    openDialog(ref) {
      this.$refs[ref].open()
    },
    closeDialog(ref) {
      this.$refs[ref].close()
    },
    updateStoredShownTimezones() {
      localStorage.shownTimezones = JSON.stringify(this.shownTimezones)
    },
    addTimezone(timezone) {
      this.shownTimezones.push(timezone.value)
      this.updateStoredShownTimezones()
    },
    removeTimezone(timezoneValue) {
      this.shownTimezones.splice(this.shownTimezones.indexOf(timezoneValue), 1)
      this.updateStoredShownTimezones()
    },
    clearAll() {
      this.shownTimezones = []
      this.updateStoredShownTimezones()
    },
    scoreTimezone(timezone, query) {
      let score = 0
      let searchStrings = [timezone.text, timezone.value]
      if (timezone.utc) {
        searchStrings.push(...timezone.utc)
      }
      for (let i = 0; i < searchStrings.length; ++i) {
        if (searchStrings[i].toLowerCase().search(query.toLowerCase()) !== -1) {
          ++score
        }
      }
      return score
    },
    clearSearchQuery() {
      this.addTimezoneSearchQuery = ''
    }
  }
}
</script>

<style>
.main-content {
  padding: 16px;
}

.timezone-card-wrapper {
  margin: 16px;
  min-width: 280px;
}

.add-timezone-dialog-content {
  margin-right: 12px;
  margin-left: 12px;
}

.timezones-list-item {
  padding-top: 2px;
  padding-bottom: 2px;
}
</style>
