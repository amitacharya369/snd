# Antigravity Agent Guidelines: SND Project

## 1. Terminal Execution & Shell Rules
- **Active Shell:** The execution shell on this system is Windows PowerShell.
- **Node.js & Git Availability:** Node.js (v22+) and Git are already present in the Windows PATH (`OpenJS.NodeJS` and `Git\cmd`).
  - **DO NOT** prepend or re-assign `$env:PATH` in command strings.
  - **DO NOT** concatenate multi-statement strings like `$env:PATH = ... + $env:PATH Set-Location ...`.
- **Working Directory:**
  - The repository root is `C:\Users\Production\Documents\SND`.
  - The tool execution working directory defaults to `C:\Users\Production\Documents`.
- **Approved Build Commands:**
  To build the project reliably from any directory, use one of the following:
  1. `npm --prefix "C:\Users\Production\Documents\SND" run build`
  2. `cmd.exe /c "C:\Users\Production\Documents\SND\build.cmd"`
  3. `& "C:\Users\Production\Documents\SND\build.ps1"`
  4. `Set-Location "C:\Users\Production\Documents\SND"; npm run build`
- **Exit Code Verification:**
  Always verify the exit code (`$LASTEXITCODE` in PowerShell, `%ERRORLEVEL%` in CMD, or `Command exited with code 0`) before reporting that a build succeeded. Never report success without capturing the exit code.

## 2. Preventing KaTeX / LaTeX Rendering Failures
- **The KaTeX Error Cause:** Antigravity's chat UI parses any text between two unescaped dollar signs (`$...$`) as LaTeX math. If a response contains `$env:PATH` and another dollar sign in the same paragraph, KaTeX attempts to parse Windows backslash paths like `\Users` as LaTeX commands (macros), triggering:
  `Failed to render LaTeX: KaTeX parse error: Undefined control sequence: \Users`
- **Mandatory Output Formatting Rules:**
  - **Always fence terminal output:** Put all command lines, terminal outputs, stack traces, and paths inside fenced code blocks (` ```powershell `, ` ```cmd `, or ` ```text `).
  - **Always use backticks for inline code:** Wrap shell variables, commands, and paths in backticks (e.g. `` `$env:PATH` ``, `` `C:\Users\...` ``).
  - **Escape literal dollar signs:** In regular markdown text, escape literal dollar signs as `\$` (e.g. `\$100`).
  - Never allow raw Windows backslashes (`\Users`, `\Production`) to appear inside unescaped dollar-delimited text.
