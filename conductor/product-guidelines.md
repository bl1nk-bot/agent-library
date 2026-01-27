# Product Guidelines

## Brand & Design Philosophy
- **Digital Noir & Glass Foundry:** The core aesthetic is a sophisticated, dark-mode-first interface that combines the elegance of "Digital Noir" (deep blacks, high contrast, subtle micro-noise textures) with the tangible depth of "Glass Foundry" (translucent layers, frosted glass effects, sharp edges).
- **Luxury & Power:** The user experience should feel premium and professional. Transitions should be smooth, animations meaningful, and interactions responsive. The interface acts as a high-performance "Command Deck" rather than a simple web page.
- **Clean & Intelligent:** The "Log Stream" replaces the traditional chat bubble interface. Information is organized hierarchically, with intelligent collapsing of dense data (logs, code) into interactive "chips" to maintain a clean, readable stream.

## User Experience (UX) Principles
1.  **Immersive First Impression:** The application launch sequence ("The Gateway") establishes the technological prowess of the tool with a radar scanner and system initialization sequence, building anticipation before revealing the main interface.
2.  **Information Hierarchy:** The layout (Engine Rack, The Stream, Active Context Rack) is designed to keep critical context always visible ("Active Context") while allowing the conversation flow ("The Stream") to take center stage.
3.  **Context Retention:** The "Active Context Rack" acts as a persistent memory bank, allowing users to "pin" crucial information, reinforcing the idea of an intelligent workspace that remembers what matters.
4.  **Proactive Cleanliness:** The "Auto-Focus" mechanism automatically detects complex outputs (like long code blocks) and encapsulates them, keeping the main stream clutter-free while providing dedicated, powerful views for inspection when needed.
5.  **Tactile Transparency:** Actions like installing tools from "The Armory" visualize the underlying process (e.g., terminal logs), balancing high-level ease of use with low-level transparency for developer trust.

## Communication Style
- **Systematic & Precise:** The AI's voice should be professional, direct, and structured. Avoid conversational filler. Use clear headings, bullet points, and code blocks.
- **Role-Based Adaptation:** The AI should seamlessly adapt its persona based on the active agent (e.g., a "Security Analyst" agent speaks differently than a "Creative Writer"), but the underlying system voice remains consistent.
- **Context-Aware:** Responses should implicitly demonstrate an understanding of the user's current project state, constraints, and previous "pinned" context.

## Design System Specifications
- **Color Palette:**
    - **Background:** `#0A0A0A` (Deep Black) with subtle noise texture.
    - **Accents:**
        - **Terminal Green:** For user inputs, success states, and system-level notifications.
        - **Agent Specific:** Cyberpunk Violet (System), Electric Cyan (Gemini), Gold (Claude), etc.
    - **Glass Elements:** Translucent dark layers with varying blur radii and thin, crisp borders.
- **Typography:**
    - **Primary:** Clean sans-serif for UI elements and general text.
    - **Code/Input:** High-legibility monospace font for the command stream and code editors.
- **Components:**
    - **The Stream:** A linear, top-down flow of interaction.
    - **Engine Rack:** Vertical status indicators for agent health/activity.
    - **Omni-Bar:** A floating, powerful input field with command auto-completion.
    - **Memory Chips:** Small, interactive UI elements representing pinned context or summarized data.

## Implementation Guidelines
- **Frontend Framework:** React, Vue, or Svelte are recommended for their component-based architecture and state management capabilities, essential for handling the complex, real-time nature of the "Command Deck".
- **Styling:** TailwindCSS is preferred for rapid, utility-first styling that facilitates the implementation of the specific design system constraints. Framer Motion (or similar) is crucial for the "luxury" feel of animations.
- **State Management:** A robust global state solution is required to manage the complex interactions between the Stream, Active Context, and Agent statuses.
