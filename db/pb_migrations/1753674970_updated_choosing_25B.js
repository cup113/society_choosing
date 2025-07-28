/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("6lcvyw2x8slj5b4")

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "llxyw8vdwy6tiwn",
    "hidden": false,
    "id": "m7zfbfuo",
    "maxSelect": 3,
    "minSelect": 1,
    "name": "choices",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("6lcvyw2x8slj5b4")

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "llxyw8vdwy6tiwn",
    "hidden": false,
    "id": "m7zfbfuo",
    "maxSelect": 7,
    "minSelect": 1,
    "name": "choices",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
