export function getSiteStyles(siteStyles: any): string {
    const styles: string[] = [];

    // Colors
    siteStyles?.primary && styles.push(`--color-primary: ${siteStyles.primary}`);
    siteStyles?.primaryContent && styles.push(`--color-primary-content: ${siteStyles.primaryContent}`);
    siteStyles?.secondary && styles.push(`--color-secondary: ${siteStyles.secondary}`);
    siteStyles?.secondaryContent && styles.push(`--color-secondary-content: ${siteStyles.secondaryContent}`);
    siteStyles?.accent && styles.push(`--color-accent: ${siteStyles.accent}`);
    siteStyles?.accentContent && styles.push(`--color-accent-content: ${siteStyles.accentContent}`);
    siteStyles?.neutral && styles.push(`--color-neutral: ${siteStyles.neutral}`);
    siteStyles?.neutralContent && styles.push(`--color-neutral-content: ${siteStyles.neutralContent}`);
    siteStyles?.base100 && styles.push(`--color-base-100: ${siteStyles.base100}`);
    siteStyles?.base200 && styles.push(`--color-base-200: ${siteStyles.base200}`);
    siteStyles?.base300 && styles.push(`--color-base-300: ${siteStyles.base300}`);
    siteStyles?.baseContent && styles.push(`--color-base-content: ${siteStyles.baseContent}`);
    siteStyles?.info && styles.push(`--color-info: ${siteStyles.info}`);
    siteStyles?.infoContent && styles.push(`--color-info-content: ${siteStyles.infoContent}`);
    siteStyles?.success && styles.push(`--color-success: ${siteStyles.success}`);
    siteStyles?.successContent && styles.push(`--color-success-content: ${siteStyles.successContent}`);
    siteStyles?.warning && styles.push(`--color-warning: ${siteStyles.warning}`);
    siteStyles?.warningContent && styles.push(`--color-warning-content: ${siteStyles.warningContent}`);
    siteStyles?.error && styles.push(`--color-error: ${siteStyles.error}`);
    siteStyles?.errorContent && styles.push(`--color-error-content: ${siteStyles.errorContent}`);

    // Radius
    siteStyles?.radiusSelector && styles.push(`--radius-selector: ${siteStyles.radiusSelector}`);
    siteStyles?.radiusField && styles.push(`--radius-field: ${siteStyles.radiusField}`);
    siteStyles?.radiusBox && styles.push(`--radius-box: ${siteStyles.radiusBox}`);

    // Misc
    siteStyles?.sizeSelector && styles.push(`--size-selector: ${siteStyles.sizeSelector}`);
    siteStyles?.sizeField && styles.push(`--size-field: ${siteStyles.sizeField}`);
    siteStyles?.borderWidth && styles.push(`--border: ${siteStyles.borderWidth}px`);
    typeof siteStyles?.depth !== 'undefined' && styles.push(`--depth: ${siteStyles.depth ? 1 : 0}`);
    typeof siteStyles?.noise !== 'undefined' && styles.push(`--noise: ${siteStyles.noise ? 1 : 0}`);

    // Text Sizes
    siteStyles?.textXs && styles.push(`--text-xs: ${siteStyles.textXs}`);
    siteStyles?.textSm && styles.push(`--text-sm: ${siteStyles.textSm}`);
    siteStyles?.textBase && styles.push(`--text-base: ${siteStyles.textBase}`);
    siteStyles?.textLg && styles.push(`--text-lg: ${siteStyles.textLg}`);
    siteStyles?.textXl && styles.push(`--text-xl: ${siteStyles.textXl}`);
    siteStyles?.text2xl && styles.push(`--text-2xl: ${siteStyles.text2xl}`);
    siteStyles?.text3xl && styles.push(`--text-3xl: ${siteStyles.text3xl}`);
    siteStyles?.text4xl && styles.push(`--text-4xl: ${siteStyles.text4xl}`);
    siteStyles?.text5xl && styles.push(`--text-5xl: ${siteStyles.text5xl}`);
    siteStyles?.text6xl && styles.push(`--text-6xl: ${siteStyles.text6xl}`);
    siteStyles?.text7xl && styles.push(`--text-7xl: ${siteStyles.text7xl}`);
    siteStyles?.text8xl && styles.push(`--text-8xl: ${siteStyles.text8xl}`);
    siteStyles?.text9xl && styles.push(`--text-9xl: ${siteStyles.text9xl}`);

    // Freeform Styles
    siteStyles?.freeFormStyles && styles.push(`${siteStyles.freeFormStyles}`);
    
    return styles.join('; ');
}
