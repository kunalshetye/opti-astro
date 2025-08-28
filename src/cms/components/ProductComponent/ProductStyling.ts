import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getProductStyles(displaySettings: DisplaySettingsFragment[]): {
    layoutClass: string;
    imagePositionClass: string;
    contentPositionClass: string;
    textAlignClass: string;
    priceColorClass: string;
    badgeColorClass: string;
    buttonColorClass: string;
    borderClass: string;
    shadowClass: string;
    roundedClass: string;
    paddingClass: string;
    marginClass: string;
} {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);

    // Layout configuration
    const productLayout = settings['productLayout'] ?? 'horizontal';
    let layoutClass = '';
    switch (productLayout) {
        case 'horizontal':
            layoutClass = 'grid md:grid-cols-2';
            break;
        case 'vertical':
            layoutClass = 'flex flex-col';
            break;
        case 'compact':
            layoutClass = 'grid md:grid-cols-3';
            break;
        default:
            layoutClass = 'grid md:grid-cols-2';
            break;
    }

    // Image position
    const imagePosition = settings['imagePosition'] ?? 'left';
    let imagePositionClass = '';
    let contentPositionClass = '';
    switch (imagePosition) {
        case 'right':
            imagePositionClass = 'md:order-2';
            contentPositionClass = 'md:order-1';
            break;
        case 'top':
            imagePositionClass = 'md:order-1';
            contentPositionClass = 'md:order-2';
            break;
        case 'left':
        default:
            imagePositionClass = 'md:order-1';
            contentPositionClass = 'md:order-2';
            break;
    }

    // Text alignment
    const textAlignment = settings['textAlignment'] ?? 'left';
    let textAlignClass = '';
    switch (textAlignment) {
        case 'center':
            textAlignClass = 'text-center';
            break;
        case 'right':
            textAlignClass = 'text-right';
            break;
        case 'left':
        default:
            textAlignClass = 'text-left';
            break;
    }

    // Price color
    const priceColor = settings['priceColor'] ?? 'default';
    let priceColorClass = '';
    switch (priceColor) {
        case 'primary':
            priceColorClass = 'text-primary';
            break;
        case 'secondary':
            priceColorClass = 'text-secondary';
            break;
        case 'accent':
            priceColorClass = 'text-accent';
            break;
        case 'success':
            priceColorClass = 'text-success';
            break;
        case 'info':
            priceColorClass = 'text-info';
            break;
        case 'warning':
            priceColorClass = 'text-warning';
            break;
        case 'error':
            priceColorClass = 'text-error';
            break;
        case 'default':
        default:
            priceColorClass = '';
            break;
    }

    // Badge color
    const badgeColor = settings['badgeColor'] ?? 'error';
    let badgeColorClass = '';
    switch (badgeColor) {
        case 'primary':
            badgeColorClass = 'badge-primary';
            break;
        case 'secondary':
            badgeColorClass = 'badge-secondary';
            break;
        case 'accent':
            badgeColorClass = 'badge-accent';
            break;
        case 'info':
            badgeColorClass = 'badge-info';
            break;
        case 'success':
            badgeColorClass = 'badge-success';
            break;
        case 'warning':
            badgeColorClass = 'badge-warning';
            break;
        case 'error':
        default:
            badgeColorClass = 'badge-error';
            break;
    }

    // Button color - map underscored keys back to daisyUI classes
    const buttonColor = settings['buttonColor'] ?? 'btn_primary';
    let buttonColorClass = buttonColor.replace(/_/g, '-');

    // Border style
    const borderStyle = settings['borderStyle'] ?? 'none';
    let borderClass = '';
    switch (borderStyle) {
        case 'border':
            borderClass = 'border border-base-300';
            break;
        case 'border_2':
            borderClass = 'border-2 border-base-300';
            break;
        case 'border_primary':
            borderClass = 'border border-primary';
            break;
        case 'border_secondary':
            borderClass = 'border border-secondary';
            break;
        case 'border_accent':
            borderClass = 'border border-accent';
            break;
        case 'none':
        default:
            borderClass = '';
            break;
    }

    // Shadow style
    const shadowStyle = settings['shadowStyle'] ?? 'none';
    let shadowClass = '';
    switch (shadowStyle) {
        case 'shadow_sm':
            shadowClass = 'shadow-sm';
            break;
        case 'shadow':
            shadowClass = 'shadow';
            break;
        case 'shadow_lg':
            shadowClass = 'shadow-lg';
            break;
        case 'shadow_xl':
            shadowClass = 'shadow-xl';
            break;
        case 'shadow_2xl':
            shadowClass = 'shadow-2xl';
            break;
        case 'none':
        default:
            shadowClass = '';
            break;
    }

    // Rounded corners
    const rounded = settings['rounded'] ?? 'rounded-lg';
    let roundedClass = '';
    switch (rounded) {
        case 'rounded':
            roundedClass = 'rounded';
            break;
        case 'rounded_md':
            roundedClass = 'rounded-md';
            break;
        case 'rounded_lg':
            roundedClass = 'rounded-lg';
            break;
        case 'rounded_xl':
            roundedClass = 'rounded-xl';
            break;
        case 'rounded_2xl':
            roundedClass = 'rounded-2xl';
            break;
        case 'rounded_3xl':
            roundedClass = 'rounded-3xl';
            break;
        case 'none':
        default:
            roundedClass = '';
            break;
    }

    // Padding - map underscored keys back to Tailwind classes
    const padding = settings['padding'] ?? 'p_6';
    let paddingClass = padding.replace(/_/g, '-');

    // Margin - map underscored keys back to Tailwind classes
    const margin = settings['margin'] ?? 'm_0';
    let marginClass = margin.replace(/_/g, '-');

    return {
        layoutClass,
        imagePositionClass,
        contentPositionClass,
        textAlignClass,
        priceColorClass,
        badgeColorClass,
        buttonColorClass,
        borderClass,
        shadowClass,
        roundedClass,
        paddingClass,
        marginClass
    };
}