---
trigger: always_on
globs: package.json
---

# Dependency Hygiene Rule

กฎการจัดการ Library และ Dependencies:

1. **Auto-Install**: ทุกครั้งที่มีการแก้ไขไฟล์ `package.json` (เช่น เพิ่ม/ลบ Library) ต้องรัน `npm install` ทันทีเพื่อให้ `package-lock.json` เป็นปัจจุบันเสมอ
2. **Redundancy Check**: ก่อนติดตั้ง Library ใหม่ ต้องตรวจสอบก่อนว่ามี Library เดิมที่ทำหน้าที่ซ้ำกันหรือไม่ (เช่น ไม่ติดตั้ง `axios` หากโปรเจกต์ใช้ `fetch` หรือมีตัวอื่นอยู่แล้ว)
3. **Save Exact**: หากเป็นไปได้ให้ใช้เวอร์ชันที่ระบุชัดเจนเพื่อป้องกันปัญหา Breaking Changes ในอนาคต
