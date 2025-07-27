/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // remove
  collection.schema.removeField("ifpzohdf")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oaq1vdbb",
    "name": "role",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "student",
        "teacher"
      ]
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ofjukwha",
    "name": "class",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "(高(一|二)\\d班)|教师"
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ifpzohdf",
    "name": "role",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "student|teacher"
    }
  }))

  // remove
  collection.schema.removeField("oaq1vdbb")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ofjukwha",
    "name": "class",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "高(一|二)[1234]班|教师"
    }
  }))

  return dao.saveCollection(collection)
})
