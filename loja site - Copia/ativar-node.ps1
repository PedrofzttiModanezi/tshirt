# Coloca o Node.js no PATH só nesta janela do terminal.
# Uso:  . .\ativar-node.ps1
# (tem de começar com ponto + espaço — "dot source")

$pastas = @(
    "${env:ProgramFiles}\nodejs",
    "${env:LOCALAPPDATA}\Programs\nodejs"
)
$x86 = [Environment]::GetEnvironmentVariable("ProgramFiles(x86)")
if ($x86) { $pastas += "$x86\nodejs" }

foreach ($p in $pastas) {
    if (Test-Path "$p\node.exe") {
        if ($env:Path -notlike "*$p*") {
            $env:Path = "$p;$env:Path"
        }
    }
}

if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "OK: node = $( (Get-Command node).Source )"
    Write-Host "OK: npm  = $( (Get-Command npm).Source )"
} else {
    Write-Host "Node nao encontrado. Instale em https://nodejs.org e reinicie o Cursor."
}
