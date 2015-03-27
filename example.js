var JSONMGR = require('./')
var json = new JSONMGR({dir:"./",target:"package.json",watch:true})

json.init().then(function(){console.log.bind(console))
json.on("changed",function(j){console.log(j.toJSON())})
