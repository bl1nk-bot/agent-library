import fs from 'fs';

const files = [
  'src/__tests__/api/collection.test.ts',
  'src/__tests__/api/comments.test.ts',
  'src/__tests__/api/prompts-id.test.ts',
  'src/__tests__/api/prompts.test.ts',
  'src/__tests__/api/reports.test.ts',
  'src/__tests__/api/search.test.ts',
  'src/__tests__/api/user-profile.test.ts',
  'src/__tests__/api/vote.test.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/GET\(req, \{ params \}\)/g, "GET(req, { params } as any)");
  content = content.replace(/PATCH\(req, \{ params \}\)/g, "PATCH(req, { params } as any)");
  content = content.replace(/POST\(req, \{ params \}\)/g, "POST(req, { params } as any)");
  content = content.replace(/DELETE\(req, \{ params \}\)/g, "DELETE(req, { params } as any)");
  fs.writeFileSync(file, content);
}
