/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("llxyw8vdwy6tiwn")

  collection.updateRule = "@request.auth.role = \"teacher\""

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6ehwdeul",
    "name": "rejects",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("llxyw8vdwy6tiwn")

  collection.updateRule = null

  // remove
  collection.schema.removeField("6ehwdeul")

  return dao.saveCollection(collection)
})
