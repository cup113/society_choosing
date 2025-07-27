/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r8y1ijogotx8gfw")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bd2ddilk",
    "name": "ip",
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
  const collection = dao.findCollectionByNameOrId("r8y1ijogotx8gfw")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bd2ddilk",
    "name": "IP",
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
})
