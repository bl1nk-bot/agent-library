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
  content = content.replace(/GET\(req, null\)/g, "GET(req, {} as any)");
  content = content.replace(/PATCH\(req, null\)/g, "PATCH(req, {} as any)");
  content = content.replace(/POST\(req, null\)/g, "POST(req, {} as any)");
  content = content.replace(/DELETE\(req, null\)/g, "DELETE(req, {} as any)");
  fs.writeFileSync(file, content);
}
