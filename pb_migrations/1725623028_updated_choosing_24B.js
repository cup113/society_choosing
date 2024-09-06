/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r8y1ijogotx8gfw")

  collection.updateRule = "@request.auth.role = \"teacher\""

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lmrrtgyy",
    "name": "rejects",
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r8y1ijogotx8gfw")

  collection.updateRule = ""

  // remove
  collection.schema.removeField("lmrrtgyy")

  return dao.saveCollection(collection)
})
