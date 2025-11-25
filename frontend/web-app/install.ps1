# Admin Web Dashboard - Installation Script

Write-Host "=======================================" -ForegroundColor Green
Write-Host "Admin Web Dashboard Setup" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

# Navigate to web-app directory
$webAppPath = "frontend\web-app"
if (-Not (Test-Path $webAppPath)) {
    Write-Host "Error: frontend/web-app directory not found!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Red
    exit 1
}

Set-Location $webAppPath

Write-Host "Step 1: Installing dependencies..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Error: npm install failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Creating .env file..." -ForegroundColor Cyan
if (-Not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host ".env file created!" -ForegroundColor Green
}
else {
    Write-Host ".env file already exists." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start the development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Open your browser:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Login with admin credentials:" -ForegroundColor White
Write-Host "   - Email: your-admin@email.com" -ForegroundColor Yellow
Write-Host "   - Password: your-admin-password" -ForegroundColor Yellow
Write-Host "   - Role must be 'admin' in database" -ForegroundColor Yellow
Write-Host ""

Write-Host "Quick Commands:" -ForegroundColor Cyan
Write-Host "  npm run dev      - Start development server" -ForegroundColor White
Write-Host "  npm run build    - Build for production" -ForegroundColor White
Write-Host "  npm run preview  - Preview production build" -ForegroundColor White
Write-Host ""

Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "  README.md        - Full documentation" -ForegroundColor White
Write-Host "  QUICKSTART.md    - Quick start guide" -ForegroundColor White
Write-Host ""

Write-Host "Ready to start? Run: npm run dev" -ForegroundColor Green
Write-Host ""
