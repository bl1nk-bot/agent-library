const fs = require('fs');

let content = fs.readFileSync('src/__tests__/api/register.test.ts', 'utf8');

content = content.replace(/features: \{\},/g, 'features: { privatePrompts: false, changeRequests: false, categories: false, tags: false, aiSearch: false } as any,');
content = content.replace(/image: "/g, 'avatar: "');

content = content.replace(/vi\.mocked\(db\.user\.findUnique\)\.mockImplementation\(async \(args\) => \{/g, 'vi.mocked(db.user.findUnique).mockImplementation((async (args: any) => {');
content = content.replace(/\} as never;/g, '} as any;');
content = content.replace(/return null;\n      \}\);/g, 'return null;\n      }) as any);');

fs.writeFileSync('src/__tests__/api/register.test.ts', content);
