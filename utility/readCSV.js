import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export default function readCSV(file_name) {
    const records = parse(fs.readFileSync(path.join("datasets", file_name)), {
        columns: true,
        skip_empty_lines: true
    });

    return records;
}