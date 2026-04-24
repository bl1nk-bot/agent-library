---
trigger: glob
globs: src/**/*.tsx
---

# React State & Lifecycle Safety

ป้องกันปัญหาจุกจิกที่มักเกิดขึ้นซ้ำ:

1. **Render Phase Safety**: ห้ามอ่านหรือเขียน `ref.current` ระหว่างขั้นตอนการ Render เด็ดขาด (ย้ายไปไว้ใน `useEffect` หรือ Event Handler)
2. **State over Refs**: หากค่าใดมีผลต่อการแสดงผลของ UI ให้ใช้ `useState` แทน `useRef`
3. **Effect Cleanup**: ทุกครั้งที่ใช้ `useEffect` กับ Subscription, Timer, หรือ Event Listener ต้องมี Cleanup Function เสมอ
4. **Key Prop**: ห้ามใช้ Array Index เป็น `key` ในการ Loop เว้นแต่ข้อมูลจะเป็น Static จริงๆ
