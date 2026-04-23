---
trigger: glob
globs: messages/**/*.json
---

# Localization Integrity Rule

เมื่อมีการแก้ไขไฟล์แปลภาษา:

1. **Key Sync**: ต้องเพิ่ม Key ใหม่ให้ครบทุก 18 ภาษาเสมอ (ใช้ `en.json` เป็นแม่แบบ)
2. **Placeholders**: ตรวจสอบ `{placeholder}` ให้ถูกต้องตามรูปแบบ `next-intl`
3. **Auto-Verify**: ทุกครั้งที่แก้ไขเสร็จ ให้รัน `node scripts/check-translations.js` อัตโนมัติ
4. **No Empty Values**: ห้ามทิ้งค่าว่าง (Empty String) ให้ใช้ค่าจากภาษาอังกฤษแทนหากยังไม่มีคำแปล
