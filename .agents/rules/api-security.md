---
trigger: glob
globs: src/app/api/**/*.ts
---

# API Security & Validation

กฎสำหรับ API Routes:

1. **Zod Validation**: ทุก API ต้องใช้ `zod` ในการตรวจสอบ Input ทั้ง Body และ Query Params
2. **Auth Guard**: ต้องรัน `auth()` เพื่อเช็ค Session เสมอ (ยกเว้น Public API) หากไม่ผ่านต้อง Return 401
3. **Consistent Response**: ส่ง Error ในรูปแบบ `{ error: "message" }` พร้อม HTTP Status Code ที่เหมาะสม
4. **Singletons**: ใช้ `db` (Prisma) และ `auth` จาก `lib/` เท่านั้น ห้าม Import ตัวติดตั้งใหม่
