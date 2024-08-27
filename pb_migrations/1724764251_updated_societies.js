/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("llxyw8vdwy6tiwn")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ejmo5rnr",
    "name": "teacher",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yllenjvf",
    "name": "limit",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("llxyw8vdwy6tiwn")

  // remove
  collection.schema.removeField("ejmo5rnr")

  // remove
  collection.schema.removeField("yllenjvf")

  return dao.saveCollection(collection)
})
