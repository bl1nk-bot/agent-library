---
trigger: glob
globs: **/*
---

# General DevOps & Environment

กฎการจัดการสภาพแวดล้อมและคำสั่ง:
1. **Makefile First**: ให้ความสำคัญกับการใช้คำสั่งผ่าน `Makefile` (เช่น `make dev`, `make qa`) มากกว่ารันคำสั่งดิบ
2. **Env Synchronization**: ก่อนเริ่มงานใหม่ ให้รัน `node scripts/sync-env.js` เพื่อเช็คว่า `.env` ตรงกับตัวอย่างหรือไม่
3. **Commit Messages**: เขียน Commit Message ในรูปแบบ Imperative (เช่น "Add feature" ไม่ใช่ "Added feature") และห้ามใช้ `--no-verify`
4. **No Console**: ลบ `console.log` ที่ใช้ Debug ออกก่อนส่งงาน (อนุญาตเฉพาะ `console.error` ในจุดที่จำเป็น)
