---
trigger: always_on
globs: **/*
---

# Context Auto-Update Rule

กฎการรักษา Context ของโปรเจกต์:
1. **Self-Tracking**: ทุกครั้งที่เสร็จสิ้น Task สำคัญ หรือมีการเปลี่ยนแปลงไฟล์หลายจุด Agent ต้องอัปเดตไฟล์ `task.md` (Checklist) ให้เป็นปัจจุบันโดยอัตโนมัติ
2. **Auto-Walkthrough**: สรุปสิ่งที่ทำไปทั้งหมดลงใน `walkthrough.md` พร้อมรายละเอียดเชิงเทคนิคที่จำเป็น เพื่อให้การเริ่มงานในรอบถัดไปรวดเร็วขึ้น
3. **Plan Sync**: หากมีการเปลี่ยนแปลงแนวทางจากแผนเดิม ต้องอัปเดต `implementation_plan.md` ทันที
