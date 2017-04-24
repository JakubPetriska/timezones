import App from '@/App'
import TestUtils from '../TestUtils.js'
import Vue from 'vue'
import timezonesjson from 'timezones.json'

const ALL_MOCK_TIMEZONES_COUNT = 10
const VALID_MOCK_TIMEZONES_COUNT = 8

function getApp(propsData) {
  return TestUtils.getMountedComponent(App, propsData)
}

function getAppWithTimezonesjson() {
  return getApp({ timezones: timezonesjson })
}

function getMockTimezonesAllValid() {
  const timezones = []
  for (let i = 0; i < ALL_MOCK_TIMEZONES_COUNT; ++i) {
    timezones.push({
      text: 'timezone_' + i + '-text',
      value: 'timezone_' + i + '-value',
      offset: i,
      utc: [
        'timezone_' + i + '-utc_1'
      ]
    })
  }
  return timezones
}

function getMockTimezonesSomeValid() {
  const timezones = getMockTimezonesAllValid()
  for (let i = VALID_MOCK_TIMEZONES_COUNT;
    i < ALL_MOCK_TIMEZONES_COUNT; ++i) {
    delete timezones[i].utc
  }
  return timezones
}

describe('App.vue', () => {
  beforeEach(function() {
    localStorage.clear()
  })

  it('initially has 0 shown timezones', () => {
    expect(getAppWithTimezonesjson().shownTimezones.length).to.equal(0)
  })

  it('properly adds timezone to shownTimezones and removes it', () => {
    const vm = getAppWithTimezonesjson()
    expect(vm.shownTimezones.length).to.equal(0)
    const timezoneToAdd = vm.notAddedTimezones[0]
    vm.addTimezone(timezoneToAdd)
    expect(vm.shownTimezones.length).to.equal(1)
    vm.removeTimezone(timezoneToAdd.value)
    expect(vm.shownTimezones.length).to.equal(0)
  })

  it('properly adds timezone to shownTimezones and removes it with clear all', () => {
    const vm = getAppWithTimezonesjson()
    expect(vm.shownTimezones.length).to.equal(0)
    const timezoneToAdd = vm.notAddedTimezones[0]
    vm.addTimezone(timezoneToAdd)
    expect(vm.shownTimezones.length).to.equal(1)
    vm.clearAll()
    expect(vm.shownTimezones.length).to.equal(0)
  })

  it('properly renders added timezone', done => {
    const vm = getAppWithTimezonesjson()
    // Make sure the component has 0 added timezones otherwise the test is gonna fail
    expect(vm.shownTimezones.length).to.equal(0)
    const timezoneToAdd = vm.notAddedTimezones[0]
    vm.addTimezone(timezoneToAdd)
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('#timezone-name').textContent)
        .to.equal(timezoneToAdd.text)
      done()
    })
  })

  it('has one less available timezone after one is added', () => {
    const vm = getAppWithTimezonesjson()
    const availableTimezoneCount = vm.notAddedTimezones.length
    vm.addTimezone(vm.notAddedTimezones[0])
    expect(vm.notAddedTimezones.length).to.equal(availableTimezoneCount - 1)
  })

  it('properly filters initial timezones list', () => {
    const timezones = getMockTimezonesSomeValid()
    const vm = getApp({ timezones })
    expect(vm.availableTimezones.size).to.equal(VALID_MOCK_TIMEZONES_COUNT)
  })

  it('properly removes no longer valid timezones from shown timezones', () => {
    const timezonesAllValid = getMockTimezonesAllValid()
    const vm = getApp({ timezones: timezonesAllValid })
    // Add timezone that will later be invalid to shown timezones
    vm.addTimezone(timezonesAllValid[timezonesAllValid.length - 1])
    // Check that timezone was added
    expect(vm.shownTimezones.length).to.equal(1)
    vm.$destroy()

    const timezonesSomeValid = getMockTimezonesSomeValid()
    // Create new Vue instance and pass in new timezone object where
    // previously shown timezone is invalid
    const newVm = getApp({ timezones: timezonesSomeValid })
    // Check that no timezones are shown since the one previously
    // shown is now invalid
    expect(newVm.shownTimezones.length).to.equal(0)
  })
})
