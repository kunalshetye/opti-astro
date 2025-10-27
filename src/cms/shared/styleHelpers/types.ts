/**
 * Shared TypeScript types for style helpers
 */

/**
 * Standard color options used across the theme
 */
export type ThemeColor =
    | 'transparent'
    | 'base_100'
    | 'base_200'
    | 'base_300'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'neutral'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';

/**
 * Standard spacing scale
 */
export type SpacingSize =
    | 'none'
    | 'small'
    | 'medium'
    | 'large'
    | 'xl'
    | 'xxl'
    | 'verylarge';  // Legacy support

/**
 * Standard border radius scale
 */
export type BorderRadius =
    | 'none'
    | 'standard'  // Legacy: maps to 'none'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | 'xl2'
    | 'xl3'
    | 'xl4'
    | 'full'
    // Legacy Image/Video naming
    | 'small'     // Maps to xs or sm depending on component
    | 'medium'    // Maps to md
    | 'large'     // Maps to lg
    | 'xlarge'    // Maps to xl
    | 'x3large'   // Maps to xl3
    | 'huge'      // Maps to xl4
    | 'xhuge';    // Maps to full

/**
 * Text transform options
 */
export type TextTransform =
    | 'normal'
    | 'keep'       // Legacy: maps to 'normal'
    | 'uppercase'
    | 'lowercase'
    | 'capitalize'
    | 'normal_case';  // Legacy Card header

/**
 * Text alignment options
 */
export type TextAlignment =
    | 'left'
    | 'center'
    | 'right'
    | 'justify';

/**
 * Vertical alignment options
 */
export type VerticalAlignment =
    | 'start'
    | 'center'
    | 'end'
    | 'stretch'
    | 'baseline';

/**
 * Horizontal alignment / Justify options
 */
export type HorizontalAlignment =
    | 'start'
    | 'center'
    | 'end';

/**
 * Button style variants
 */
export type ButtonStyle =
    | 'standard'
    | 'soft'
    | 'outline'
    | 'dash'
    | 'neutral'
    | 'link'
    | 'ghost'
    | 'wide'
    | 'disabled';

/**
 * Button color type
 */
export type ButtonType =
    | 'primary'
    | 'secondary'
    | 'neutral'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';

/**
 * Button size options
 */
export type ButtonSize =
    | 'xs'
    | 'sm'
    | 'medium'
    | 'lg'
    | 'xl'
    | 'responsive';

/**
 * Button width options
 */
export type ButtonWidth =
    | 'w_6rem'
    | 'w_9rem'
    | 'w_10rem'
    | 'w_12rem'
    | 'w_15rem'
    | 'w_20rem'
    | 'auto'
    | 'half'
    | 'full'
    | 'responsive';

/**
 * Button action (hover effect)
 */
export type ButtonAction =
    | 'static'
    | 'bouncy';

/**
 * Hover effect options
 */
export type HoverEffect =
    | 'none'
    | 'zoom_subtle'
    | 'zoom';

/**
 * Shadow options
 */
export type Shadow =
    | 'none'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl';

/**
 * Opacity/tint levels (0-100)
 */
export type OpacityLevel =
    | 'o_0'
    | 'o_10'
    | 'o_20'
    | 'o_30'
    | 'o_40'
    | 'o_50'
    | 'o_60'
    | 'o_70'
    | 'o_75'
    | 'o_80'
    | 'o_90'
    | 'o_100';

/**
 * Image fit options
 */
export type ImageFit =
    | 'object_cover'
    | 'object_contain'
    | 'object_fill'
    | 'object_none'
    | 'object_scale_down';

/**
 * Grid column options
 */
export type GridColumns =
    | 'auto'
    | 'col1'
    | 'col2'
    | 'col3'
    | 'col4'
    | 'col5'
    | 'col6'
    // Legacy naming
    | 'c1'
    | 'c2'
    | 'c3'
    | 'c4';

/**
 * Responsive breakpoint options
 */
export type Breakpoint =
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl';
