 = 'E:\apps\prescripto\src\app\features-modules\doctor\prescribe\components\modals\follow-up\follow-up.component.html'
 = Get-Content -Path  -Raw
 =  -replace '    @if \\(loading\\.isSkelton\\) \\{\\r?\\n    <app-skelton \\/>\\r?\\n    \\}\\r?\\n\\r?\\n', ''
 =  -replace '@if \\(!loading\\.isSkelton && bookmarkedFollowup\\.length > 0\\)', '@if (bookmarkedFollowup.length > 0)'
 =  -replace '@if \\(selectedFollowUps\\.length == 0 && !loading\\.isSkelton\\)', '@if (selectedFollowUps.length == 0)'
$insert = @
    @if (bookmarkedFollowup.length == 0) {
    <div class="prescripto-modal__empty">
      <p class="text-lg font-semibold">No follow ups found</p>
      <p class="text-sm text-brand-neutral/60">Try searching and bookmarking a follow up to reuse it quickly.</p>
    </div>
    }


'@
$target = @
    }

    <section *ngIf="selectedFollowUps.length > 0"
'@
$replacement = "    }`r`n`r`n" + $insert + '    <section *ngIf="selectedFollowUps.length > 0"'
$text = $text -replace [Regex]::Escape($target.TrimStart()), $replacement
Set-Content -Path $path -Value $text
