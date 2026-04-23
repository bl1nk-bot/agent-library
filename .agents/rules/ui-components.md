---
trigger: glob
---

# UI & Component Standards

กฎการสร้างและแก้ไข UI:
1. **Never Hardcode**: ห้ามใส่ข้อความภาษาอังกฤษ/ไทยลงใน JSX ตรงๆ ต้องใช้ `useTranslations()` เท่านั้น
2. **Tailwind 4**: ใช้ Utility Classes ของ Tailwind 4 เป็นหลัก และใช้ `cn()` utility ในการจัดการ Dynamic Classes
3. **A11y**: 
   - ปุ่มต้องมี `aria-label` หากไม่มี Text ภายใน
   - รูปภาพต้องมี `alt` property เสมอ
4. **Shadcn Pattern**: รักษาโครงสร้าง Atomic Design ตามแบบ Shadcn UI (แบ่ง `ui/` กับคอมโพเนนต์ระดับ Feature)
