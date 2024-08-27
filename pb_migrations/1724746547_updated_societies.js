/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("llxyw8vdwy6tiwn")

  // remove
  collection.schema.removeField("ejcaj0nm")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cliaw71e",
    "name": "description",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vv5kbhqd",
    "name": "coreMembers",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ejcaj0nm",
    "name": "description_site",
    "type": "url",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  // remove
  collection.schema.removeField("cliaw71e")

  // remove
  collection.schema.removeField("vv5kbhqd")

  return dao.saveCollection(collection)
})
