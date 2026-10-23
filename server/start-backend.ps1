# 启动食光后端（本机开发环境）
# 用法：
#   .\start-backend.ps1              # 直接启动，已启动则只提示
#   .\start-backend.ps1 -Restart     # 重启后端
#   .\start-backend.ps1 -Rebuild     # 重新打包后再启动

param(
  [switch]$Restart,
  [switch]$Rebuild
)

$ErrorActionPreference = 'Stop'
$serverDir = $PSScriptRoot
$jar = Join-Path $serverDir 'target\shiguang-server.jar'
$java = 'C:\Program Files\Java\jdk-21\bin\java.exe'
$mvn = Join-Path $serverDir '.tools\apache-maven-3.9.11\bin\mvn.cmd'
$mysql = 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe'
$dataDir = Join-Path $serverDir '.devmysql\data'
$log = Join-Path $env:TEMP 'shiguang-backend.log'
$err = Join-Path $env:TEMP 'shiguang-backend.err.log'

function Test-Port([int]$Port) {
  return [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
}

function Wait-Port([int]$Port, [int]$Seconds) {
  for ($i = 0; $i -lt $Seconds; $i++) {
    if (Test-Port $Port) { return $true }
    Start-Sleep -Seconds 1
  }
  return $false
}

Write-Host '=== 食光后端启动 ===' -ForegroundColor Cyan

# 1. 检查 Java
if (-not (Test-Path $java)) {
  $cmd = Get-Command java -ErrorAction SilentlyContinue
  if (-not $cmd) {
    Write-Host '没有找到 Java 21。请安装 JDK 21，或修改脚本中的 $java 路径。' -ForegroundColor Red
    exit 1
  }
  $java = $cmd.Source
}
Write-Host "Java: $java"

# 2. 检查开发 MySQL（3307）
if (-not (Test-Port 3307)) {
  if (-not (Test-Path $mysql)) {
    Write-Host '3307 数据库没有启动，也没有找到 mysqld.exe。' -ForegroundColor Red
    Write-Host '请先启动 Navicat 使用的 MySQL，或修改 application-dev.yml 连接其它端口。' -ForegroundColor Yellow
    exit 1
  }
  if (-not (Test-Path $dataDir)) {
    Write-Host "找不到开发数据库目录：$dataDir" -ForegroundColor Red
    exit 1
  }
  Write-Host '3307 数据库未启动，正在启动开发 MySQL...' -ForegroundColor Yellow
  $mysqlLog = Join-Path $env:TEMP 'shiguang-mysql.log'
  $mysqlArgs = '--no-defaults --datadir="' + $dataDir + '" --port=3307 --bind-address=127.0.0.1 --console'
  Start-Process -FilePath $mysql -ArgumentList $mysqlArgs -WindowStyle Hidden `
    -RedirectStandardOutput $mysqlLog -RedirectStandardError ($mysqlLog + '.err') | Out-Null
  if (-not (Wait-Port 3307 25)) {
    Write-Host '开发 MySQL 启动失败。请查看：' -ForegroundColor Red
    Write-Host "  $mysqlLog"
    Write-Host "  $mysqlLog.err"
    exit 1
  }
}
Write-Host 'MySQL: 127.0.0.1:3307 已就绪' -ForegroundColor Green

# 3. 检查 8080 是否已有后端
if (Test-Port 8080) {
  if (-not $Restart -and -not $Rebuild) {
    Write-Host '后端已经在 8080 运行，无需重复启动。' -ForegroundColor Green
    Write-Host '接口：http://127.0.0.1:8080/api/v1/bootstrap'
    Write-Host '如需重启，请运行：.\start-backend.ps1 -Restart'
    Write-Host '如需重新打包并重启，请运行：.\start-backend.ps1 -Rebuild'
    exit 0
  }
  Write-Host '正在停止旧的后端进程...' -ForegroundColor Yellow
  $conn = Get-NetTCPConnection -LocalPort 8080 -State Listen | Select-Object -First 1
  Stop-Process -Id $conn.OwningProcess -Force
  Start-Sleep -Seconds 2
}

# 4. 按需重新打包
if ($Rebuild -or -not (Test-Path $jar)) {
  Write-Host '正在打包后端...' -ForegroundColor Yellow
  if (-not (Test-Path $mvn)) {
    Write-Host '找不到项目内的 Maven。请安装 Maven，或恢复 server\.tools。' -ForegroundColor Red
    exit 1
  }
  $env:JAVA_HOME = 'C:\Program Files\Java\jdk-21'
  Push-Location $serverDir
  try {
    & $mvn -q -DskipTests package
    if ($LASTEXITCODE -ne 0) {
      Write-Host '打包失败，请查看上面的 Maven 输出。' -ForegroundColor Red
      exit $LASTEXITCODE
    }
  } finally {
    Pop-Location
  }
}

# 5. 启动后端
if (-not (Test-Path $jar)) {
  Write-Host "找不到 jar：$jar" -ForegroundColor Red
  exit 1
}
Write-Host '正在启动后端...' -ForegroundColor Yellow
$appArgs = @(
  '-jar', $jar,
  '--spring.profiles.active=dev',
  '--server.port=8080',
  ('--app.upload-dir=' + (Join-Path $serverDir 'uploads-dev'))
)
$proc = Start-Process -FilePath $java -ArgumentList $appArgs -WorkingDirectory $serverDir `
  -WindowStyle Hidden -RedirectStandardOutput $log -RedirectStandardError $err -PassThru

if (-not (Wait-Port 8080 35)) {
  Write-Host '后端启动超时。请查看日志：' -ForegroundColor Red
  Write-Host "  $log"
  Write-Host "  $err"
  if (Test-Path $err) { Get-Content $err -Tail 25 }
  exit 1
}

Write-Host ''
Write-Host '后端启动成功。' -ForegroundColor Green
Write-Host "接口：http://127.0.0.1:8080/api/v1/bootstrap"
Write-Host "前端：http://127.0.0.1:5173/"
Write-Host "日志：$log"
Write-Host "进程：$($proc.Id)"
