import { Parser } from "json2csv";
import fs from "fs";

async function createCSV(fields, data, csvPath) {
    try {
        // Capitalize each field name
        const capitalizedFields = fields.map(field =>
            field.charAt(0).toUpperCase() + field.slice(1)
        );

        // Map data to use capitalized field names
        const capitalizedData = data.map(item => {
            const newItem = {};
            for (const field of fields) {
                newItem[field.charAt(0).toUpperCase() + field.slice(1)] = item[field];
            }
            return newItem;
        });

        const parser = new Parser({ fields: capitalizedFields });
        const csv = parser.parse(capitalizedData);

        fs.writeFileSync(csvPath, csv);
        return true;
    } catch (error) {
        console.error("Error creating CSV:", error);
        return false;
    }
}

export default createCSV;
