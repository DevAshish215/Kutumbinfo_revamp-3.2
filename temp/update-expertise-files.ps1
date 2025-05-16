# PowerShell Script to Update Expertise HTML Files

# List of all expertise files to update
$expertiseFiles = @(
    "Expertise/angular.html",
    "Expertise/flutter.html",
    "Expertise/java.html",
    "Expertise/nodejs.html", 
    "Expertise/php.html",
    "Expertise/vuejs.html",
    "Expertise/wordpress.html"
)

# Process each file
foreach ($file in $expertiseFiles) {
    Write-Host "Processing $file..."
    
    # Read the content of the file
    $content = Get-Content -Path $file -Raw
    
    # Remove the expertise.css import
    $content = $content -replace '<link rel="stylesheet" href="../assets/css/expertise.css">', '<!-- Removed expertise.css as styles are now in style.css and responsive.css -->'
    
    # Update all class names with their expertise- prefixed equivalents
    $replacements = @{
        'class="hero-section' = 'class="expertise-hero-section'
        'class="hero-container' = 'class="expertise-hero-container'
        'class="hero-content' = 'class="expertise-hero-content'
        'class="breadcrumb' = 'class="expertise-breadcrumb'
        'class="text-accent' = 'class="expertise-text-accent'
        'class="hero-image' = 'class="expertise-hero-image'
        'class="inner-ring' = 'class="expertise-inner-ring'
        'class="particles-container' = 'class="expertise-particles-container'
        'class="overview-section' = 'class="expertise-overview-section'
        'class="overview-grid' = 'class="expertise-overview-grid'
        'class="overview-content' = 'class="expertise-overview-content'
        'class="highlight-box' = 'class="expertise-highlight-box'
        'class="overview-image' = 'class="expertise-overview-image'
        'class="services-section' = 'class="expertise-services-section'
        'class="services-grid' = 'class="expertise-services-grid'
        'class="service-card' = 'class="expertise-service-card'
        'class="service-icon' = 'class="expertise-service-icon'
        'class="service-content' = 'class="expertise-service-content'
        'class="process-section' = 'class="expertise-process-section'
        'class="process-steps' = 'class="expertise-process-steps'
        'class="process-step' = 'class="expertise-process-step'
        'class="step-number' = 'class="expertise-step-number'
        'class="step-content' = 'class="expertise-step-content'
        'class="benefits-section' = 'class="expertise-benefits-section'
        'class="benefits-cards' = 'class="expertise-benefits-cards'
        'class="benefit-card' = 'class="expertise-benefit-card'
        'class="benefit-icon' = 'class="expertise-benefit-icon'
        'class="benefit-features' = 'class="expertise-benefit-features'
        'class="benefits-stats' = 'class="expertise-benefits-stats'
        'class="stat-item' = 'class="expertise-stat-item'
        'class="stat-number' = 'class="expertise-stat-number'
        'class="stat-text' = 'class="expertise-stat-text'
        'class="cta-section' = 'class="expertise-cta-section'
        'class="cta-content' = 'class="expertise-cta-content'
        'class="cta-button' = 'class="expertise-cta-button'
        'class="reveal-section' = 'class="expertise-reveal-section'
        'class="reveal-item' = 'class="expertise-reveal-item'
    }
    
    # Apply each replacement
    foreach ($key in $replacements.Keys) {
        $content = $content.Replace($key, $replacements[$key])
    }
    
    # Write the updated content back to the file
    Set-Content -Path $file -Value $content
    
    Write-Host "Updated $file successfully"
}

Write-Host "All files have been updated." 