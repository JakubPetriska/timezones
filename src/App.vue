<template>
  <div id="app">
    <md-toolbar>
      <h1 class="md-title">Timezones</h1>
    </md-toolbar>
    
    <div class="main-content">
      <hello></hello>
    </div>
  </div>
</template>

<script>
import Hello from './components/Hello'

export default {
  name: 'app',
  components: {
    Hello
  }
}
</script>

<style>
.main-content {
  padding: 16px;
}
</style>
