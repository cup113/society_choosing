/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("llxyw8vdwy6tiwn")

  // remove field
  collection.fields.removeById("cliaw71e")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("llxyw8vdwy6tiwn")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "cliaw71e",
    "max": 0,
    "min": 0,
    "name": "description",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
