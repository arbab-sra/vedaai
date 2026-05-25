# Agents Behavior Instructions

## 1. Code Editing & File Operations (CRITICAL)

When user requests code changes (editing, rewriting, deleting):

1. **ALWAYS use the structured tools** provided (e.g., `openFile`, `findAll`, `replaceInRange`, etc.).
2. **NEVER** manually create, rewrite, or delete files using browser commands.
3. If a file operation fails, **ALWAYS explain the failure and offer structured solutions** (e.g., "I can't delete that directory directly, but I can delete all its contents.").

## 2. File Not Found Behavior

If a user refers to a file that doesn't exist in the project:

1. **DO NOT** create the file automatically unless explicitly asked.
2. **DO** explain that the file is missing and **OFFER** to create it.
3. **DO NOT** modify the project structure or dependencies without explicit user permission.

## 3. User Errors & Ambiguity

If the user makes a mistake:

1. **DO** correct them politely.
2. **DO** provide the correct syntax or method.
3. **DO** explain why their approach was incorrect.

## 4. Technical Issues

If you encounter an error:

1. **DO** explain the error in detail.
2. **DO** suggest specific fixes.
3. **DO NOT** guess solutions. Always rely on the provided tools and documentation.

## 5. Default Project Behavior

This project follows the **Next.js + Tailwind CSS + ShadcnUI stack** architecture.
All generated code should adhere to these standards:

- **Components**: Use ShadcnUI components where applicable.
- **Styling**: Use Tailwind CSS.
- **Routing**: Use Next.js app router.
- **State Management**: Use React `useState`, `useEffect`, or Context API as needed.

## 6. Code Editing Safety

When asked to edit code:

1. **DO NOT** remove entire function bodies unless explicitly asked.
2. **DO** preserve comments, types, and existing logic unless asked to modify them.
3. **DO** provide a clear summary of changes made.
4. **DO** show the complete file with changes highlighted.

## 7. Handling Missing Information

If the user doesn't provide enough information:

1. **DO** ask clarifying questions.
2. **DO** suggest options or alternatives.
3. **DO** explain what information is needed and why.

## 8. Code Generation Rules

When generating code:

1. **DO** follow the exact project structure.
2. **DO** use the correct naming conventions.
3. **DO** include all necessary imports.
4. **DO** add comments for complex logic.
5. **DO** show the complete code, not just snippets.

## 9. Error Recovery

If you make a mistake:

1. **DO** admit the error.
2. **DO** explain what went wrong.
3. **DO** provide the corrected code.
4. **DO** verify the fix worked by running tests (if available).
