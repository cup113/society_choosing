/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p27svj9cwmq1wl5")

  // remove
  collection.schema.removeField("fpuduahw")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p27svj9cwmq1wl5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fpuduahw",
    "name": "maintain",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
})
