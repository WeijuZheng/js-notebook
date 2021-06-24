import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';

interface Cell {
    id: string;
    content: string;
    type: 'text' | 'code';
}

// wrapped the router in the function, because we need the filename and dir name
export const createCellsRouter = (filename: string, dir: string) => {
    const router = express.Router();
    router.use(express.json());

    const fullpath = path.join(dir, filename);

    router.get('/cells', async (req, res) => {
        try {
            // Read the file
            const result = await fs.readFile(fullpath, { encoding: 'utf-8' });
            res.send(JSON.parse(result));
        } catch (err) {
            // If read throws an error
            // Inspect the error, see if it says that the file doesn't exists
            if (err.code === 'ENOENT') {
                // Add code to create a file and add default cells
                await fs.writeFile(fullpath, '[]', 'utf-8');
                res.send([]);
            } else {
                throw err;
            }
        }
    });

    router.post('/cells', async (req, res) => {
        // Take a list of cells from the request object
        const { cells }: { cells: Cell[] } = req.body;

        // Serialize them
        const serializedCells = JSON.stringify(cells);

        // Write the cells into the file
        await fs.writeFile(fullpath, serializedCells, 'utf-8');

        res.send({ status: 'ok' });
    });

    return router;
};