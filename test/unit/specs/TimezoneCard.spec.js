import TimezoneCard from '@/components/TimezoneCard'
import TestUtils from '../TestUtils.js'

describe('TimezoneCard.vue', () => {
  it('renders correct timezone name', () => {
    ['Time', 'Zone', 'test'].forEach(text => {
      let vm = TestUtils.getMountedComponent(TimezoneCard, {
        timezoneName: text,
        timezoneKey: 'UTC-11'
      })
      expect(vm.$el.querySelector('#timezone-name').textContent)
        .to.equal(text)
    })
  })
})

// TODO test that times are proper and respect given timezone
