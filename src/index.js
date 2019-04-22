const path = require('path');
const { emperors } = require('@dailynodemodule/emperor-data');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs-extra');

const outputDir = process.env.OUTPUT_DIR || path.join(process.cwd(), 'output');
const dbPath = path.join(outputDir, 'db.sqlite');

(async () => {
    await fs.ensureDir(outputDir);
    await fs.writeFile(dbPath, Buffer.from([0]));

    // A database can be opened/created on the disk, or stored in memory by using ':memory:'  as the path.
    const db = new sqlite3.Database(dbPath);

    // You can run commands sequentially by wrapping them in `serialize`
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS emperors (
                name TEXT UNIQUE,
                imageUrl TEXT,
                url TEXT,
                reignStart INTEGER,
                reignEnd INTEGER
            );
        `);

        for (const emperor of emperors) {
            console.log(`inserting: ${emperor.name}`);
            db.run(`
                INSERT INTO emperors VALUES(
                    '${emperor.name}',
                    '${emperor.imageUrl}',
                    '${emperor.url}',
                    ${emperor.reignStart},
                    ${emperor.reignEnd}
                );
            `);
        }

    });

    db.each(`SELECT * FROM emperors;`, (err, row) => {
        console.log(`retrieved: ${JSON.stringify(row, null, 4)}`)
    })

    db.close();
})();