# Random commit messages list
$messages = @(
    "update tweaks",
    "small fixes",
    "patch applied",
    "minor improvements",
    "refactor change",
    "cleanup",
    "bug fix",
    "adjust config",
    "optimize code",
    "final touch",
    "quick update",
    "style improvements",
    "UI enhancements",
    "performance boost",
    "code cleanup",
    "dependency update",
    "fix typo",
    "improve layout",
    "update styles",
    "refactor components",
    "add validation",
    "update documentation",
    "improve responsiveness",
    "fix alignment",
    "update dependencies",
    "enhance UX",
    "fix spacing",
    "improve accessibility",
    "update colors",
    "fix navigation",
    "optimize images",
    "improve performance",
    "update fonts",
    "fix responsive design",
    "add animations",
    "improve loading",
    "update API calls",
    "fix error handling",
    "improve state management",
    "update routing"
)

# Get all modified, added or deleted files (including files inside folders)
$files = git ls-files --modified --others --exclude-standard

# Also get deleted files
$deletedFiles = git ls-files --deleted

# Combine both lists
$allFiles = $files + $deletedFiles

foreach ($file in $allFiles) {
    # Skip if empty
    if ([string]::IsNullOrWhiteSpace($file)) { continue }
    
    # Pick a random message
    $msg = Get-Random -InputObject $messages
    
    Write-Host "Staging and committing: $file with message: '$msg'" -ForegroundColor Green
    
    # Add file
    git add "$file"
    
    # Commit file
    git commit -m "$msg"
}

Write-Host "`nAll changes committed successfully!" -ForegroundColor Cyan