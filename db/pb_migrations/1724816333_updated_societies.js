/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("llxyw8vdwy6tiwn")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "paosxyi8",
    "name": "question",
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
  collection.schema.removeField("paosxyi8")

  return dao.saveCollection(collection)
})
