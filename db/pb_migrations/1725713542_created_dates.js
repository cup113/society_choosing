/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "p27svj9cwmq1wl5",
    "created": "2024-09-07 12:52:22.257Z",
    "updated": "2024-09-07 12:52:22.257Z",
    "name": "dates",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ij2xbeoe",
        "name": "start",
        "type": "date",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "9gngghd3",
        "name": "end",
        "type": "date",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "fcz1ymo8",
        "name": "temporary",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("p27svj9cwmq1wl5");

  return dao.deleteCollection(collection);
})
