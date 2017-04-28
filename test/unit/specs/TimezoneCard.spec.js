import momenttz from 'moment-timezone'
import TestUtils from '../TestUtils.js'
import TimezoneCard from '@/components/TimezoneCard'

// Test that timezone name is properly rendered
describe('TimezoneCard.vue', () => {
  it('renders correct timezone name', () => {
    ['Time', 'Zone', 'test'].forEach(text => {
      const vm = TestUtils.getMountedComponent(TimezoneCard, {
        timezoneName: text,
        timezoneKey: 'Etc/GMT+11'
      })
      expect(vm.$el.querySelector('#timezone-name').textContent)
        .to.equal(text)
    })
  })
})

// Test that TimezoneCard uses proper time for display (properly offset by it's timezone)
describe('TimezoneCard.vue', () => {
  it('uses correct timezone', () => {
    const londonTimezoneCard = TestUtils.getMountedComponent(TimezoneCard, {
      timezoneName: 'London time',
      timezoneKey: 'Europe/London'
    })
    const pragueTimezoneCard = TestUtils.getMountedComponent(TimezoneCard, {
      timezoneName: 'Prague time',
      timezoneKey: 'Europe/Prague'
    })

    const currentTimeForLondon = momenttz()
    const currentTimeForPrague = currentTimeForLondon.clone()

    const londonTime = londonTimezoneCard.adjustTimezone(currentTimeForLondon)
    const pragueTime = pragueTimezoneCard.adjustTimezone(currentTimeForPrague)

    const testTimeFormat = 'YYYY-MM-DD HH:mm'
    expect(londonTime.format(testTimeFormat))
      .to.equal(pragueTime.subtract(1, 'h').format(testTimeFormat))
  })
})
