/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p27svj9cwmq1wl5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "79hyoycw",
    "name": "name",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p27svj9cwmq1wl5")

  // remove
  collection.schema.removeField("79hyoycw")

  return dao.saveCollection(collection)
})
