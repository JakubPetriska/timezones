<template>
  <md-dialog v-on:close="clearSearchQueryDelayed()" v-on:open="setFocusToSearchBar">
    <md-dialog-title>
      <span>Add timezone</span>
      <md-input-container style="padding-bottom:0">
        <md-input id="search-bar" v-model="searchQuery" @keyup.native.enter="selectFirst() && close()" placeholder="Search for timezone name, city, state or offset">
        </md-input>
      </md-input-container>
    </md-dialog-title>
  
    <md-dialog-content class="add-timezone-dialog-content">
      <md-list>
        <md-list-item v-for="timezone in searchedTimezones" :key="timezone.value" class="timezones-list-item" @click.native="addTimezone(timezone); close()">
          <div class="md-list-text-container">
            <span>{{timezone.value}}</span>
            <span>{{timezone.text}}</span>
          </div>
        </md-list-item>
      </md-list>
    </md-dialog-content>
  
    <md-dialog-actions>
      <md-button class="md-primary" @click.native="close()">Cancel</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
export default {
  name: 'add-timezone-dialog',
  props: ['timezones'],
  data: function () {
    return {
      searchQuery: ''
    }
  },
  created: function () {
    window.addEventListener('keyup', (e) => {
      if (e.code === 'Escape') {
        this.close()
      }
    })
  },
  computed: {
    searchedTimezones() {
      if (!this.searchQuery) {
        return this.timezones
      } else {
        return this.timezones
          .map(timezone => {
            return {
              score: this.scoreTimezone(timezone, this.searchQuery),
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
    close() {
      // First and only child of this component is the dialog element
      this.$children[0].close()
    },
    setFocusToSearchBar() {
      window.setTimeout(function () {
        document.getElementById('search-bar').focus()
      }, 0)
    },
    addTimezone(timezone) {
      this.$emit('add-timezone', timezone)
    },
    scoreTimezone(timezone, query) {
      let score = 0
      const searchStrings = [timezone.text, timezone.value]
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
    clearSearchQueryDelayed() {
      // Clearing needs to be delayed, otherwise the dialog often resizes before closing
      setTimeout(() => { this.searchQuery = '' }, 100)
    },
    selectFirst() {
      const timezones = this.searchedTimezones
      if (timezones.length === 1) {
        this.addTimezone(timezones[0])
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style>
.add-timezone-dialog-content {
  margin-right: 12px;
  margin-left: 12px;
}

.timezones-list-item {
  padding-top: 2px;
  padding-bottom: 2px;
}
</style>
