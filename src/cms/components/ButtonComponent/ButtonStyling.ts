import type { DisplaySettingsFragment } from '../../../../__generated/sdk.ts';
import { getDictionaryFromDisplaySettings } from '../../../graphql/shared/displaySettingsHelpers.ts';

export function getButtonStyles(displaySettings: DisplaySettingsFragment[], needButtonType: Boolean = true): {
    // buttonStyle: string;
    // buttonType: string;
} {
    const settings: Record<string, string> =
        getDictionaryFromDisplaySettings(displaySettings);
    
    let cssClasses: string[] = [];
    
    // Button text transform
    if(settings['transform'] && settings['transform'] !== "keep") {
        cssClasses.push(settings['transform']);
    }

    // Button style
    const buttonStyle = settings['buttonStyle'];
    const allButtonStyles : { [key: string]: any } = 
        {standard: 'btn-standard',
         soft: 'btn-soft',
         outline: 'btn-outline',
         dash: 'btn-dash',
         neutral: 'btn-neutral',
         link: 'btn-link',
         ghost: 'btn-ghost',
         wide: 'btn-wide',
         disabled: 'btn-disabled'
        };
    if(buttonStyle) {
        cssClasses.push(`${allButtonStyles[buttonStyle]}`);
    }
    
    // Button type
    // Note: button type added to CallToAction and Card buttons directly
    if (needButtonType) { 
        const buttonType = settings['buttonType'];
        const allButtonTypes  : { [key: string]: any } = 
            {primary: 'btn-primary',
            secondary: 'btn-secondary',
            neutral: 'btn-neutral',
            accent: 'btn-accent',
            info: 'btn-info',
            success: 'btn-success',
            warning: 'btn-warning',
            error: 'btn-error'
            };
        if(buttonType) {
            cssClasses.push(`${allButtonTypes[buttonType]}`);
        } else {
            // Default type: btn-primary
            cssClasses.push('btn-primary');
        }
    }

    // Button width
    const buttonWidth = settings['buttonWidth'] ?? '';
    let widthClass = 'w-[9rem]';
    switch (buttonWidth) {
        case 'w_6rem':
            widthClass = 'w-[6rem]';
            break;
        case 'w_9rem':
            widthClass = 'w-[9rem]';
            break;
        case 'w_10rem':
            widthClass = 'w-[10rem]';
            break;
        case 'w_12rem':
            widthClass = 'w-[12rem]';
            break;
        case 'w_15rem':
            widthClass = 'w-[15rem]';
            break;
        case 'w_20rem':
            widthClass = 'w-[20rem]';
            break;
        case 'auto':
            widthClass = '';
            break;
        case 'half':
            widthClass = 'w-1/2';
            break;
        case 'full':
            widthClass = 'btn-block';
            break;
        case 'responsive':
            widthClass = 'btn-block sm:w-[9rem] md:w-[12rem] lg:w-[15rem] xl:w-[20rem]';
            break;
        default:
            widthClass = 'w-[9rem]';
            break;
    }
    cssClasses.push(widthClass);

    // Button size
    const buttonSize = settings['buttonSize'] ?? '';
    let sizeClass = '';
    switch (buttonSize) {
        case 'xs':
            sizeClass = 'btn-xs';
            break;
        case 'sm':
            sizeClass = 'btn-sm';
            break;
        case 'medium':
            sizeClass = '';
            break;
        case 'lg':
            sizeClass = 'btn-lg';
            break;
        case 'xl':
            sizeClass = 'btn-xl';
            break;
        case 'responsive':
            sizeClass = 'btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl';
            break;
        default:
            sizeClass = '';
            break;
    }
    cssClasses.push(sizeClass);
    
    // Button rounded corners
    const buttonRadius = settings['buttonRadius'];
    const allButtonRadii : { [key: string]: any } = 
        {standard: 'rounded-none',
         xs: 'rounded-xs',
         sm: 'rounded-sm',
         md: 'rounded-md',
         lg: 'rounded-lg',
         xl: 'rounded-xl',
         xl2: 'rounded-2xl',
         xl3: 'rounded-3xl',
         xl4: 'rounded-4xl',
         full: 'rounded-full'
        };
    if(buttonRadius) {
        cssClasses.push(`${allButtonRadii[buttonRadius]}`);
    }

    // Button rounded corners
    const buttonAction = settings['buttonAction'];
    const allButtonAction : { [key: string]: any } = 
        {static: '',
         bouncy: 'transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg'
        };
    if(buttonAction) {
        cssClasses.push(`${allButtonAction[buttonAction]}`);
    }
    
    return cssClasses;
}
