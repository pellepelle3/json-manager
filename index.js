'use strict';

var Promise = require('promise')
  , fs = require('then-fs')
  , events = require('events')
  , Path = require('path')
  , Util = require('util')
  , deepbody = require('deepbody')
  , mkdirp = Promise.denodeify(require('mkdirp'))
  , rimraf = Promise.denodeify(require('rimraf'))




function JSONMGR(options){
  if (!Util.isObject(this)) throw new TypeError('JSONMGR must be constructed via new')
  if (!Util.isObject(options)) throw new TypeError('Options is not a object')
  if (!Util.isString(options.target)) throw new TypeError('Target is not a String')
  if (!Util.isString(options.dir)) throw new TypeError('Dir is not a String')

  var _dir = options.dir || false
    , _target = options.target
    , _autoSave = options.autoSave || true
    , _watching = options.watch || false
    , _json = {}
    , self = this

  events.EventEmitter.call(this)
  
  this.init = function(){
    if(_watching) 
      self.startWatch()  
    return self.read()
  }

  this.toJSON = function(){
    return _json
  }

  this.toString = function(){
    return JSON.stringify(_json, null, 2)
  }

  this.read = function() {
    return fs.readFile(Path.join(_dir, _target))
      .then(JSON.parse, function(e) {
        if (e.code !== 'ENOENT') throw e
        self.update({}) 
        return {}
      })
      .then(function (obj) {
        _json = obj
        return Promise.resolve(_json)
      })
  }
  this.set = function(key,value) {
    if (!Util.isString(key)) throw new TypeError('not a String')
    deepbody.set(_json,key,value)
    return self.update(_json)

  }
  this.unset = function(key) {
    if (!Util.isString(key)) throw new TypeError('not a String')
    deepbody.unset(_json,key)
    return self.update(_json)
  }
  this.get = function(key) {
    if (!Util.isString(key)) throw new TypeError('not a String')
    return deepbody.get(_json,key)
  }
  this.update = function(json) {
    if (!Util.isObject(json)) throw new TypeError('not an object')

    _json = json
    return (autoSave) ? self.save() : Promise.resolve(_json)
  }

  function saveFile(dir,target) {
    return mkdirp(dir)
      .then(fs.writeFile(Path.join(dir,target), JSON.stringify(_json, null, 2)))
      .then(Promise.resolve(_json))
  }

  this.save = function() {
    return saveFile(_dir,_target)
  }
  this.copy = function (dir,target) {
    if (!Util.isString(target)) throw new TypeError('Target is not a String')
    if (!Util.isString(dir)) throw new TypeError('Dir is not a String')
    return saveFile(dir,target)
  }

  this.delete =  function() {
    return fs.unlink(Path.join(_dir,_target))
  }

  this.move = function(dir,target){
    if (!Util.isString(target)) throw new TypeError('Target is not a String')
    if (!Util.isString(dir)) throw new TypeError('Dir is not a String')

    return fs.rename(Path.join(_dir,_target),Path.join(dir,target))
      .then(function(){
        _dir = dir
        _target = target
        self.stopWatch()
        return self.startWatch()
      })
  }

  function watch(){
    if(self.watcher) throw new Error('Already watching')
    return self.watcher = fs.watch(_dir,function(event,filename){
      if(filename == _target)
        self.read()
           .then(function(){
            self.emit("changed",self)
          })
    })
  }

  this.stopWatch = function(){
    if(self.watcher){
     self.watcher.close()
     delete self.watcher
   }
  }

  this.startWatch = function(){
    if(self.watcher) return Promise.reject("Already Watching")
    watch()
    return Promise.resolve("Started Watching")
  }
}

JSONMGR.prototype.__proto__ = events.EventEmitter.prototype
  
module.exports = JSONMGR
