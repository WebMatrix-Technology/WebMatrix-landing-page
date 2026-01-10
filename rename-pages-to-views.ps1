# PowerShell script to rename src/pages to src/views
# Run this from the project root: .\rename-pages-to-views.ps1

$pagesPath = "src\pages"
$viewsPath = "src\views"

if (Test-Path $pagesPath) {
    Write-Host "Renaming $pagesPath to $viewsPath..."
    Rename-Item -Path $pagesPath -NewName "views" -Force
    Write-Host "✓ Successfully renamed pages to views"
} else {
    Write-Host "✗ Directory $pagesPath not found"
    if (Test-Path $viewsPath) {
        Write-Host "✓ Views directory already exists"
    }
}








