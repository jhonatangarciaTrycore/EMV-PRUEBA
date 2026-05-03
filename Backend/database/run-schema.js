import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { db } from '../db.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runSchema = async () => {
    try {
        const schemaPath = resolve(__dirname, 'schema.sql');
        const schemaSql = await readFile(schemaPath, 'utf-8');

        await db.query(schemaSql);
        console.log('Schema aplicado correctamente.');
    } catch (error) {
        console.error('Error al aplicar schema.sql:', error.message);
        process.exitCode = 1;
    } finally {
        await db.end();
    }
};

runSchema();
