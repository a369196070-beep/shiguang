# 启动食光前端（本机开发环境）
# 用法：
#   .\start-frontend.ps1              # 前台启动，Ctrl+C 停止
#   .\start-frontend.ps1 -Restart     # 先停止 5173 上的旧进程再启动

param(
  [switch]$Restart
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$vite = Join-Path $root 'node_modules\vite\bin\vite.js'
$node = 'C:\Users\Administrator\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe'

function Test-Port([int]$Port) {
  return [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
}

Write-Host '=== 食光前端启动 ===' -ForegroundColor Cyan

if (-not (Test-Path $node)) {
  $cmd = Get-Command node -ErrorAction SilentlyContinue
  if (-not $cmd) {
    Write-Host '没有找到 Node.js 20.19+。' -ForegroundColor Red
    Write-Host '请安装 Node.js，或修改脚本中的 $node 路径。' -ForegroundColor Yellow
    exit 1
  }
  $node = $cmd.Source
}
Write-Host "Node: $node"

if (-not (Test-Path $vite)) {
  Write-Host '找不到 Vite，请先在项目目录执行 npm install。' -ForegroundColor Red
  exit 1
}

if (Test-Port 5173) {
  if (-not $Restart) {
    Write-Host '前端已经在 5173 运行。' -ForegroundColor Green
    Write-Host '打开：http://127.0.0.1:5173/'
    Write-Host '如需重启，请运行：.\start-frontend.ps1 -Restart'
    exit 0
  }
  Write-Host '正在停止旧的 5173 进程...' -ForegroundColor Yellow
  $conn = Get-NetTCPConnection -LocalPort 5173 -State Listen | Select-Object -First 1
  Stop-Process -Id $conn.OwningProcess -Force
  Start-Sleep -Seconds 2
}

Write-Host '正在启动 Vite...' -ForegroundColor Yellow
Write-Host '启动后打开：http://127.0.0.1:5173/'
Write-Host '按 Ctrl+C 停止前端。'
Write-Host ''

Set-Location $root
& $node $vite --host 127.0.0.1 --port 5173
