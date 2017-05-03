<template>
  <div id="app">
    <md-toolbar>
      <h1 class="md-title"
          style="flex: 1">Timezones</h1>
  
      <md-button class="md-icon-button"
                 @click.native="openDialog('clear-all-confirmation-dialog')"
                 :disabled="shownTimezones.length == 0">
        <md-icon>clear_all</md-icon>
      </md-button>
  
      <md-button class="md-icon-button"
                 @click.native="openDialog('add-timezone-dialog')">
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
  
    <clear-all-confirmation-dialog ref="clear-all-confirmation-dialog"
                                   v-on:confirm="clearAll();">
    </clear-all-confirmation-dialog>
  
    <add-timezone-dialog ref="add-timezone-dialog"
                         :timezones="notAddedTimezones"
                         v-on:add-timezone="addTimezone">
    </add-timezone-dialog>
  </div>
</template>

<script>
import TimezoneCard from './components/TimezoneCard'
import ClearAllConfirmationDialog from './components/ClearAllConfirmationDialog'
import AddTimezoneDialog from './components/AddTimezoneDialog'

export default {
  name: 'app',
  components: {
    TimezoneCard, ClearAllConfirmationDialog, AddTimezoneDialog
  },
  props: ['timezones'],
  data: function () {
    return {
      availableTimezones: new Map(),
      shownTimezones: []
    }
  },
  created: function () {
    // Add timezones from timezones property into our availableTimezones Map
    for (let i = 0; i < this.timezones.length; ++i) {
      const timezone = this.timezones[i]
      if (timezone.utc && timezone.utc.length > 0) {
        // Omit timezones withou utc field, the utc field is used to identify
        // the timezone in momenttz.js to get the proper current time.
        // Timezones withou utc field are old and unused (nothing returned by googling of such timezones)
        // At the time of writing (10.4.2017) there were 2 such timezones
        this.availableTimezones.set(timezone.value, timezone)
      }
    }

    // Try to load previously shown timezones from localStorage
    if (typeof (Storage) !== 'undefined' && localStorage.shownTimezones) {
      // Browser supports localStorage and shownTimezones are stored
      // Make sure all stored timezones are contained in available timezones, otherwise drop them
      const storedTimezones = JSON.parse(localStorage.shownTimezones)
      for (let i = 0; i < storedTimezones.length; ++i) {
        const storedTimezoneValue = storedTimezones[i]
        if (this.availableTimezones.has(storedTimezoneValue)) {
          this.shownTimezones.push(storedTimezoneValue)
        }
      }
    }
  },
  computed: {
    availableTimezonesList() {
      return Array.from(this.availableTimezones.values())
        .sort((left, right) => left.offset - right.offset)
    },
    notAddedTimezones() {
      return this.availableTimezonesList.filter(e => !this.shownTimezones.includes(e.value))
    }
  },
  methods: {
    openDialog(ref) {
      // Since dialogs are contained in their custom components the ref
      // contains wrapper Vue instance which contains the dialog as it's
      // first child.
      this.$refs[ref].$children[0].open()
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
</style>
