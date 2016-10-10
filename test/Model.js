const assert = require('assert')
const MobxModel = require('../index')
const isObservable = require('mobx').isObservable

describe('Model', () => {
  it('should set properties as observable', () => {
    const instance = new MobxModel.Model()
    instance.init({name: 'foo'})
    assert(isObservable(instance, 'name'))
  })

  it('should camelize properties', () => {
    MobxModel.config.shouldCamelize = true
    
    const instance = new MobxModel.Model()
    instance.init({test_value: 'foo'})
    assert.equal('foo', instance.testValue)
    assert(isObservable(instance, 'testValue'))
  })
})
