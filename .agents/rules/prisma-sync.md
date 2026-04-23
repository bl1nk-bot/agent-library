---
trigger: glob
globs: prisma/schema.prisma
---

# Prisma & Database Workflow

ป้องกันการลืมรันคำสั่งพื้นฐาน:
1. **Auto-Generate**: ทุกครั้งที่แก้ไข Schema เสร็จ ให้รัน `npx prisma generate` ทันทีเพื่อให้ Types เป็นปัจจุบัน
2. **Descriptive Migrations**: เมื่อสร้าง Migration ใหม่ ต้องใส่ชื่อที่สื่อความหมาย (เช่น `add_user_bio` ไม่ใช่ `fix_db`)
3. **Seed Consistency**: หากมีการเพิ่ม Field ที่เป็น Required ให้ตรวจสอบว่าต้องอัปเดตไฟล์ `prisma/seed.ts` หรือไม่
