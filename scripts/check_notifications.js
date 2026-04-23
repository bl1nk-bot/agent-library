import fs from 'fs';
import path from 'path';

const messagesDir = './messages';
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const content = JSON.parse(fs.readFileSync(path.join(messagesDir, file), 'utf8'));
  if (content.notifications) {
    console.log(`${file}:`);
    console.log(`  unreadCount: ${content.notifications.unreadCount}`);
    console.log(`  noNotifications: ${content.notifications.noNotifications}`);
  }
}
