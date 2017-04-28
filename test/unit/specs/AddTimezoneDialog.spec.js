import Vue from 'vue'
import TestUtils from '../TestUtils.js'
import AddTimezoneDialog from '@/components/AddTimezoneDialog'

const MOCK_TIMEZONES_COUNT = 5

function getAddTimezoneDialog(propsData) {
  return TestUtils.getMountedComponent(AddTimezoneDialog, propsData)
}

function getMockTimezones() {
  const timezones = []
  for (let i = 0; i < MOCK_TIMEZONES_COUNT; ++i) {
    timezones.push({
      text: 'timezone_' + i + '-text',
      value: 'timezone_' + i + '-value',
      utc: [
        'timezone_' + i + '-utc_1',
        'timezone_' + i + '-utc_2',
        'timezone_' + i + '-utc_3'
      ]
    })
  }
  return timezones
}

describe('AddTimezoneDialog.vue', () => {
  it('properly renders the list', done => {
    const timezones = getMockTimezones()
    const vm = getAddTimezoneDialog({ timezones })
    Vue.nextTick(() => {
      const dialogItemsListElement =
        vm.$el.querySelector('.add-timezone-dialog-content').firstChild
      expect(dialogItemsListElement.children.length)
        .to.equal(timezones.length)
      for (let i = 0; i < MOCK_TIMEZONES_COUNT; ++i) {
        const child = dialogItemsListElement.children[i]
        const timezone = timezones[i]
        expect(child.firstChild.firstChild.textContent).to.equal(timezone.value)
        expect(child.firstChild.children[1].textContent).to.equal(timezone.text)
      }
      done()
    })
  })

  it('displays only relevant results when searching', done => {
    const timezones = getMockTimezones()
    const vm = getAddTimezoneDialog({ timezones })
    vm.searchQuery = 'timezone_1'
    Vue.nextTick(() => {
      const dialogItemsListElement =
        vm.$el.querySelector('.add-timezone-dialog-content').firstChild
      expect(dialogItemsListElement.children.length).to.equal(1)
      const itemElement = dialogItemsListElement.firstChild
      const timezone = timezones[1]
      expect(itemElement.firstChild.firstChild.textContent).to.equal(timezone.value)
      expect(itemElement.firstChild.children[1].textContent).to.equal(timezone.text)
      done()
    })
  })
})
