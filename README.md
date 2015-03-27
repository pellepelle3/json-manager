JSON Manager
===

Install
---

```
	npm i -S json-manager
```

Options
---

Defaults
```json
	{ "dir":""
	, "target":""
	, "watch":false
	, "autoSave":true
	}

```

Example
---
```javascript

	var JSONMGR = require('json-manager')
	var json = new JSONMGR({dir:"./",target:"package.json",watch:true})

	json.init().then(console.log.bind(console))
	json.on("changed",function(j){console.log(j.toJSON())})

``` 

Functions
---

- init()  
	- returns promise calls read() 
	- Should call this on start
	- needed for watch to auto start 
- read() 
	- returns promise gives JSON (object)
	- pull data from file
	- if no data will save empty object to file with autoSave on
- toJSON()
	- returns (object) that is stored in memory
- toString()
	- returns (string) Stringify of json stored in memory
- set(key,value)
	- the key is a deepbody string "key1.key2.1"
	- sets the key
	- returns promise save to file if autoSave on
- unset(key)
	- the key is a deepbody string "key1.key2.1"
	- deletes the key from obj
	- returns promise save to file if autoSave on
- get(key)
	- the key is a deepbody string "key1.key2.1"
	- returns data
- update(json)
	- json is (object) to replace the whole object
	- returns promise save to file if autoSave on
- save()
	- force save of json in memory
	- returns promise save to file 
- copy(dir,target)
	- save of json in memory in new location
	- returns promise save to file 
- move(dir,target)
	- save of json in memory in new location
	- object now points to new file and removes old file
	- returns promise save to file 
- delete()
	- returns promise delete file 
- startWatch()
- stopWatch()