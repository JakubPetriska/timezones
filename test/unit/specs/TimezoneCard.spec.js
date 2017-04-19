import TimezoneCard from '@/components/TimezoneCard'
import TestUtils from '../TestUtils.js'
import momenttz from 'moment-timezone'

// Test that timezone name is properly rendered
describe('TimezoneCard.vue', () => {
  it('renders correct timezone name', () => {
    ['Time', 'Zone', 'test'].forEach(text => {
      let vm = TestUtils.getMountedComponent(TimezoneCard, {
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
    let londonTimezoneCard = TestUtils.getMountedComponent(TimezoneCard, {
      timezoneName: 'London time',
      timezoneKey: 'Europe/London'
    })
    let pragueTimezoneCard = TestUtils.getMountedComponent(TimezoneCard, {
      timezoneName: 'Prague time',
      timezoneKey: 'Europe/Prague'
    })

    let currentTimeForLondon = momenttz()
    let currentTimeForPrague = currentTimeForLondon.clone()

    let londonTime = londonTimezoneCard.adjustTimezone(currentTimeForLondon)
    let pragueTime = pragueTimezoneCard.adjustTimezone(currentTimeForPrague)

    let testTimeFormat = 'YYYY-MM-DD HH:mm'
    expect(londonTime.format(testTimeFormat))
      .to.equal(pragueTime.subtract(1, 'h').format(testTimeFormat))
  })
})
