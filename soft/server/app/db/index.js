const Sequelize = require("sequelize");
const { createNamespace } = require("cls-hooked");
const moment = require('moment');
const sqlite3 = require('sqlite3');
const SQLite3 = sqlite3.verbose();
const new_db = new SQLite3.Database('mydb.db');

moment.tz.setDefault("Europe/Moscow");

Sequelize.useCLS(createNamespace('ns'))

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "sqlite",
    storage: 'mydb.db',
    define: {
      timestamps: false,
      freezeTableName: true,
      underscored: true
    },
    dialectOptions: {
      supportBigNumbers: true,
      dateStrings: true,
      typeCast: true,
      decimalNumbers: true
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 20000,
      idle: 5000,
    },
    // logging: false,
  }
);

const db = {};

db.moment    = moment;
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.users = require("./models/users")(db);
db.chats = require("./models/chats")(db);

db.init_default_data = async () => db.chats.create({ chat_id: 1, msg_chat_id: null });

module.exports = db;