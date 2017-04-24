import App from '@/App'
import TestUtils from '../TestUtils.js'
import Vue from 'vue'

function getApp() {
  return TestUtils.getMountedComponent(App)
}

describe('App.vue', () => {
  it('initially has 0 shown timezones', () => {
    expect(getApp().shownTimezones.length).to.equal(0)
  })

  it('properly adds timezone to shownTimezones and removes it', () => {
    const vm = getApp()
    expect(vm.shownTimezones.length).to.equal(0)
    const timezoneToAdd = vm.notAddedTimezones[0]
    vm.addTimezone(timezoneToAdd)
    expect(vm.shownTimezones.length).to.equal(1)
    vm.removeTimezone(timezoneToAdd.value)
    expect(vm.shownTimezones.length).to.equal(0)
  })

  it('properly adds timezone to shownTimezones and removes it with clear all', () => {
    const vm = getApp()
    expect(vm.shownTimezones.length).to.equal(0)
    const timezoneToAdd = vm.notAddedTimezones[0]
    vm.addTimezone(timezoneToAdd)
    expect(vm.shownTimezones.length).to.equal(1)
    vm.clearAll()
    expect(vm.shownTimezones.length).to.equal(0)
  })

  it('properly renders added timezone', done => {
    const vm = getApp()
    // Make sure the component has 0 added timezones otherwise the test is gonna fail
    expect(vm.shownTimezones.length).to.equal(0)
    const timezoneToAdd = vm.notAddedTimezones[0]
    vm.addTimezone(timezoneToAdd)
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('#timezone-name').textContent)
        .to.equal(timezoneToAdd.text)
      vm.clearAll()
      done()
    })
  })

  it('has one less available timezone after one is added', () => {
    const vm = getApp()
    const availableTimezoneCount = vm.notAddedTimezones.length
    vm.addTimezone(vm.notAddedTimezones[0])
    expect(vm.notAddedTimezones.length).to.equal(availableTimezoneCount - 1)
  })
})

// TODO test initial creation of available timezones map (all timezones with utc are available, all without are not)
// TODO test that timezone no longer present in available timezones is dropped
