/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("llxyw8vdwy6tiwn")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "flmp3hzx",
    "name": "adjustThreshold",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": 9,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("llxyw8vdwy6tiwn")

  // remove
  collection.schema.removeField("flmp3hzx")

  return dao.saveCollection(collection)
})
