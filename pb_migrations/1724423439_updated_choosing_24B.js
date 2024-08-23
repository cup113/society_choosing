/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r8y1ijogotx8gfw")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nc7t4ubq",
    "name": "third_choice",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "llxyw8vdwy6tiwn",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r8y1ijogotx8gfw")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nc7t4ubq",
    "name": "adjust_prior",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "llxyw8vdwy6tiwn",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
