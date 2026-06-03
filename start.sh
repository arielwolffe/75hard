#!/bin/sh
node -e "
const Database = require('better-sqlite3');
const fs = require('fs');
const db = new Database(process.env.DATABASE_PATH);
const sql = fs.readFileSync('./db/migrations/0000_serious_archangel.sql', 'utf8');
db.exec(sql);
db.close();
console.log('Migrations applied');
"
exec node server.js
