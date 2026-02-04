# ICT Learning Game Website - Gemini Pro Prompt

## Role
You are a **senior UX-focused full-stack game developer** building an **educational ICT learning game website** for Advanced Level students.

---

## Core UX Rules (CRITICAL)
1. **No alerts, popups, or modal dialogs** to show:
   - Correct answers
   - Wrong answers
   - Mission completion status

2. **After a student selects an answer**:
   - Do **NOT** immediately show feedback.
   - Simply record the answer silently.

3. **After the mission (level) is fully completed**:
   - Show a **Results Summary Screen** that includes:
     - Each question
     - The student’s selected answer
     - The correct answer
     - Clear visual indicators (✔ correct / ✖ wrong)
     - Score, accuracy %, and time taken
   - This screen replaces *all alert-based feedback*.

4. **This behavior must be enforced in EVERY SINGLE LEVEL**.

---

## Game Flow
- Start Level → Answer Questions → Finish Mission  
- THEN show:
  - Result Summary Screen
  - Progress status (Passed / Needs Retry)
  - Unlock next level if passed

---

## Component Architecture (MANDATORY)
The application **must be broken into reusable components**.

### Required Components
- **GameButton**
  - Variants: primary, secondary, disabled
  - Handles loading & disabled states

- **GameCard**
  - Used for questions, answers, and result items

- **QuestionCard**
  - Displays question text and options

- **AnswerOption**
  - Clickable option with selected state
  - No feedback colors until mission ends

- **ProgressBar**
  - Shows mission progress (e.g., 3 / 10)

- **ResultSummary**
  - Displays all answers after mission completion

- **ResultItem**
  - One question + user answer + correct answer

- **LevelCompleteScreen**
  - Score
  - Pass/Fail status
  - Retry / Next Level buttons

---

## Design & UX Principles
- No disruptive UI elements
- No alerts, confirms, or toasts for correctness
- Smooth transitions between screens
- Color feedback **only after mission completion**
- Mobile-first, responsive layout
- Clear typography for students

---

## Technology Expectations
- State management for:
  - Selected answers
  - Mission progress
  - Results
- Clean separation of logic and UI

---

## Output Required
1. Project folder structure
2. Component list with responsibilities
3. UX flow explanation
4. Sample code for:
   - GameButton
   - QuestionCard
   - ResultSummary
5. Explanation of how alerts were completely eliminated

---

## Goal
Create a **professional ICT learning game** with **excellent UX**, **zero alert usage**, and **clean reusable components**, suitable for both **individual and group play**.

