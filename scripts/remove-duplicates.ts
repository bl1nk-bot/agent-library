import * as fs from "fs";
import * as path from "path";

// Slugify function
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\x2D+/g, "-");
}

// Robust CSV Parser
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

// CSV Stringifier
function toCSV(rows: string[][]): string {
    return rows.map(row => {
        return row.map(cell => {
            if (cell === null || cell === undefined) return '';
            const needsQuote = cell.includes(',') || cell.includes('"') || cell.includes('\n') || cell.includes('\r');
            if (needsQuote) {
                return `"${cell.replace(/"/g, '""')}"`;
            }
            return cell;
        }).join(',');
    }).join('\n');
}

async function main() {
  const csvPath = path.join(process.cwd(), "prompts.csv");
  console.log(`📖 Reading ${csvPath}...`);
  
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCSV(csvContent);
  
  if (rows.length === 0) {
      console.log("File is empty.");
      return;
  }

  // Header
  const header = rows[0];
  const headerLower = header.map(h => h.toLowerCase().trim());
  const idxAct = headerLower.indexOf("act");
  
  if (idxAct === -1) {
      console.error("❌ 'act' column not found.");
      return;
  }

  const seenSlugs = new Set<string>();
  const cleanedRows: string[][] = [header];
  let duplicatesCount = 0;

  // Data rows
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 2) continue; // Skip empty rows

    const title = row[idxAct]?.trim();
    if (!title) continue;

    const slug = slugify(title);

    if (seenSlugs.has(slug)) {
      duplicatesCount++;
      // console.log(`Removing duplicate: ${title}`);
    } else {
      seenSlugs.add(slug);
      cleanedRows.push(row);
    }
  }

  console.log(`\nOriginal rows: ${rows.length}`);
  console.log(`Cleaned rows: ${cleanedRows.length}`);
  console.log(`Removed duplicates: ${duplicatesCount}`);

  console.log(`💾 Writing cleaned CSV...`);
  const newContent = toCSV(cleanedRows);
  fs.writeFileSync(csvPath, newContent);
  
  console.log(`✅ prompts.csv has been updated.`);
}

main();
