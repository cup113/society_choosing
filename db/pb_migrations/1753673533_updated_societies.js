/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("llxyw8vdwy6tiwn")

  // add field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1653681396",
    "max": 0,
    "min": 0,
    "name": "lastYearBatch",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "number233827301",
    "max": null,
    "min": null,
    "name": "lastYearSeconds",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("llxyw8vdwy6tiwn")

  // remove field
  collection.fields.removeById("text1653681396")

  // remove field
  collection.fields.removeById("number233827301")

  return app.save(collection)
})
