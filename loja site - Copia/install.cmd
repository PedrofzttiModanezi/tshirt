@echo off
REM Use este ficheiro se no terminal aparecer: 'node' nao e reconhecido
REM Exemplo: install.cmd install    ou    install.cmd run dev
set "PATH=%ProgramFiles%\nodejs;%PATH%"
cd /d "%~dp0"
"%ProgramFiles%\nodejs\npm.cmd" %*
