import App from '@/App'
import TestUtils from '../TestUtils.js'

function getApp() {
  return TestUtils.getMountedComponent(App)
}

describe('App.vue', () => {
  it('initially has 0 shown timezones', () => {
    expect(getApp().shownTimezones.length).to.equal(0)
  })
  it('properly adds timezone to shownTimezones', () => {
    const vm = getApp()
    vm.addTimezone(vm.notAddedTimezones[0])
    expect(vm.shownTimezones.length).to.equal(1)
  })
  it('properly renders added timezone', () => {
    const vm = getApp()
    const timezoneToAddText = vm.notAddedTimezones[0].text

    console.log(vm.shownTimezones.length)
    console.log(timezoneToAddText)
    console.log(vm.notAddedTimezones[0])

    vm.addTimezone(vm.notAddedTimezones[0])
    expect(vm.$el.querySelector('#timezone-name').textContent)
        .to.equal(timezoneToAddText)
  })
  it('one less timezone is available after one is added', () => {
    const vm = getApp()
    const availableTimezoneCount = vm.notAddedTimezones.length
    vm.addTimezone(vm.notAddedTimezones[0])
    expect(vm.notAddedTimezones.length).to.equal(availableTimezoneCount - 1)
  })
})

// TODO test removing of timzones
// TODO test clearing of timezones

// TODO test initial creation of available timezones map (all timezones with utc are available, all without are not)
// TODO test that timezone no longer present in available timezones is dropped