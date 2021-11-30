let sqlite3 = require('sqlite3')
let { open } = require('sqlite');

const config = {
  sql: {
    createTable: `CREATE TABLE IF NOT EXISTS printInfo 
                (id integer PRIMARY KEY autoincrement, 
                oid TEXT, 
                order_no TEXT, 
                type TEXT, 
                ip TEXT,
                port TEXT, 
                body TEXT,
                remark TEXT,
                status INTEGER,
                is_read INTEGER,
                count INTEGER, 
                create_time INTEGER, 
                update_time INTEGER)`
  },
};

async function main() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database,
    cached: true
  })
  db.on('error', function (err) {
    console.log('数据库连接错误:', err)
  })
  await db.run(config.sql.createTable)

  await db.exec(`BEGIN TRANSACTION;`)
  let stmt = await db.prepare(`INSERT INTO printInfo VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  await stmt.run(null, "orderId", "order_no", "type", "ip", "port", "bodyCode", '', 0, 0, 0, Date.now(), Date.now())

  await db.exec(`COMMIT;`)
  let docs = await db.all(`SELECT id, ip, port, body FROM printInfo`)
  console.log(`docs`, docs.length);
}
main();