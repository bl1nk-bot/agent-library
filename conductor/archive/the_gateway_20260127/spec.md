# Specification: The Gateway Landing Page

## Overview
หน้าแรกที่ผู้ใช้จะพบเมื่อเข้าใช้งาน เพื่อสร้างความประทับใจด้วยธีม "Digital Noir & Glass Foundry" และตรวจสอบสถานะการเชื่อมต่อกับ AI Agents.

## UI Requirements
- **Background:** สีดำสนิท (#0A0A0A) พร้อม micro-noise texture.
- **Radar Scanner:** กราฟิกวงกลมหมุนต่อเนื่องตรงกลางจอ มีเส้นแสงกวาด (Sweep animation).
- **Handshake Status:** ข้อความแสดงสถานะระบบ (Text Feed) แสดงทีละบรรทัด เช่น [SYSTEM] Initializing..., [SCAN] Searching...
- **CTA Button:** ปุ่ม [ INITIALIZE DECK ] ที่ดูหรูหรา มีแสง Glow หรือ Pulse.

## Behavior & Transitions
- การหมุนของ Radar ต้องนุ่มนวล.
- เมื่อคลิกปุ่ม จะต้องมี Transition Effect (Zoom/Fade) เพื่อนำทางไปยังหน้า Command Deck.
