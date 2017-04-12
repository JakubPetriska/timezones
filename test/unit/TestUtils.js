import Vue from 'vue'

export default {
  getMountedComponent: function (component, propsData) {
    const Constructor = Vue.extend(component)
    return new Constructor({ propsData }).$mount()
  }
}
