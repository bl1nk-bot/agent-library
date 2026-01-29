import * as fs from "fs";
import * as path from "path";

// Slugify function matching seed script
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// Robust CSV Parser matching seed script
function parseCSV(text: string) {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuote && nextChar === '"') {
        currentCell += '"';
        i++; // Skip escaped quote
      } else {
        inQuote = !inQuote;
      }
    } else if (char === ',' && !inQuote) {
      currentRow.push(currentCell);
      currentCell = "";
    } else if ((char === '\r' || char === '\n') && !inQuote) {
      if (char === '\r' && nextChar === '\n') i++; // Handle CRLF
      
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }
  
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows;
}

async function main() {
  const csvPath = path.join(process.cwd(), "prompts.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCSV(csvContent);
  
  // Header: act,prompt,for_devs,type,contributor
  const header = rows[0].map(h => h.toLowerCase().trim());
  const idxAct = header.indexOf("act");
  const idxPrompt = header.indexOf("prompt");

  const seenSlugs = new Set<string>();
  const duplicates: string[] = [];
  const invalid: string[] = [];
  const processed: string[] = [];

  // Data rows
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 2) continue;

    const title = row[idxAct]?.trim();
    const content = row[idxPrompt]?.trim();

    if (!title || !content) {
      invalid.push(`Row ${i + 1}: Missing title or content`);
      continue;
    }

    const slug = slugify(title);

    if (seenSlugs.has(slug)) {
      duplicates.push(`Row ${i + 1}: "${title}" (Duplicate of existing slug)`);
    } else {
      seenSlugs.add(slug);
      processed.push(title);
    }
  }

  console.log("=== ANALYSIS REPORT ===");
  console.log(`Total Rows (excluding header): ${rows.length - 1}`);
  console.log(`Unique Items: ${seenSlugs.size}`);
  console.log(`Duplicates Found: ${duplicates.length}`);
  console.log(`Invalid/Empty Found: ${invalid.length}`);
  console.log(`Sum (Unique + Dup + Invalid): ${seenSlugs.size + duplicates.length + invalid.length}`);
  
  console.log("\n--- DUPLICATE ITEMS (Skipped) ---");
  duplicates.forEach(d => console.log(d));

  if (invalid.length > 0) {
    console.log("\n--- INVALID ITEMS (Skipped) ---");
    invalid.forEach(i => console.log(i));
  }
}

main();
