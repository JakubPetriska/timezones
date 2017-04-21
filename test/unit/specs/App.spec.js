import App from '@/App'
import TestUtils from '../TestUtils.js'

// TODO test adding of timezones (that it shows in shownTimezons)
describe('App.vue', () => {
  it('properly adds timezone', () => {
    const vm = TestUtils.getMountedComponent(App)

    // Component initially has 0 timezones
    expect(vm.shownTimezones.length).to.equal(0)
  })
})

// TODO test removing of timzones
// TODO test clearing of timezones

// TODO test initial creation of available timezones map (all timezones with utc are available, all without are not)
// TODO test that timezone no longer present in available timezones is dropped