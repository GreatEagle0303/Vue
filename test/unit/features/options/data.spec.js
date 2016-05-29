import Vue from 'vue'

describe('Options data', () => {
  it('should proxy and be reactive', done => {
    const data = { msg: 'foo' }
    const vm = new Vue({
      data,
      template: '<div>{{ msg }}</div>'
    }).$mount()
    expect(vm.$data).toEqual({ msg: 'foo' })
    expect(vm.$data).toBe(data)
    data.msg = 'bar'
    waitForUpdate(() => {
      expect(vm.$el.textContent).toBe('bar')
    }).then(done)
  })

  it('should warn non-function during extend', () => {
    Vue.extend({
      data: { msg: 'foo' }
    })
    expect('The "data" option should be a function').toHaveBeenWarned()
  })

  it('should merge data properly', () => {
    const Test = Vue.extend({
      data () {
        return { a: 1 }
      }
    })
    let vm = new Test({
      data: { b: 2 }
    })
    expect(vm.a).toBe(1)
    expect(vm.b).toBe(2)
    // no instance data
    vm = new Test()
    expect(vm.a).toBe(1)
    // no child-val
    const Extended = Test.extend({})
    vm = new Extended()
    expect(vm.a).toBe(1)
    // recursively merge objects
    const WithObject = Vue.extend({
      data () {
        return {
          obj: {
            a: 1
          }
        }
      }
    })
    vm = new WithObject({
      data: {
        obj: {
          b: 2
        }
      }
    })
    expect(vm.obj.a).toBe(1)
    expect(vm.obj.b).toBe(2)
  })
})
