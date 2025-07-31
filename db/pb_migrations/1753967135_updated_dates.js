/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("p27svj9cwmq1wl5")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "bool2323052248",
    "name": "isActive",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("p27svj9cwmq1wl5")

  // remove field
  collection.fields.removeById("bool2323052248")

  return app.save(collection)
})
