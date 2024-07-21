/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r8y1ijogotx8gfw")

  // remove
  collection.schema.removeField("uubjqdzi")

  // add
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "acbjrfmz",
    "name": "adjust_reject",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uubjqdzi",
    "name": "willingness",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 5000
    }
  }))

  // remove
  collection.schema.removeField("nc7t4ubq")

  // remove
  collection.schema.removeField("acbjrfmz")

  return dao.saveCollection(collection)
})
