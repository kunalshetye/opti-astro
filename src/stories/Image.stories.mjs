import ImageComponent from '../cms/components/ImageComponent/Image.astro';
import { ds, IMAGES, mockImageRef, mockPayload } from './_mocks.ts';

export default {
    component: ImageComponent,
};

const base = { key: 'image', contentPayload: mockPayload };

// ── Aspect ratios ─────────────────────────────────────────────────────────

export const Default = {
    args: {
        ...base,
        data: { __typename: 'Image', AltText: 'Modern office building exterior', Image: mockImageRef(IMAGES.landscape) },
        displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'default'), ds('orientation', 'landscape'), ds('roundedCorners', 'none')],
    },
};

export const Square = {
    args: {
        ...base,
        data: { __typename: 'Image', AltText: 'Team collaboration photo', Image: mockImageRef(IMAGES.office) },
        displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'square'), ds('roundedCorners', 'medium')],
    },
};

export const Widescreen = {
    args: {
        ...base,
        data: { __typename: 'Image', AltText: 'Nature landscape panorama', Image: mockImageRef(IMAGES.nature) },
        displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'widescreen'), ds('roundedCorners', 'large')],
    },
};

export const Banner = {
    args: {
        ...base,
        data: { __typename: 'Image', AltText: 'Abstract gradient banner', Image: mockImageRef(IMAGES.abstract) },
        displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'banner'), ds('roundedCorners', 'small')],
    },
};

export const Monitor = {
    args: {
        ...base,
        data: { __typename: 'Image', AltText: 'Classic monitor ratio photo', Image: mockImageRef(IMAGES.office) },
        displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'monitor'), ds('roundedCorners', 'none')],
    },
};

export const Photo = {
    args: {
        ...base,
        data: { __typename: 'Image', AltText: 'Photo ratio landscape', Image: mockImageRef(IMAGES.landscape) },
        displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'photo'), ds('roundedCorners', 'none')],
    },
};

// ── Orientation ───────────────────────────────────────────────────────────

export const Landscape = {
    args: {
        ...base,
        data: { __typename: 'Image', AltText: 'Landscape oriented photo', Image: mockImageRef(IMAGES.landscape) },
        displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'default'), ds('orientation', 'landscape'), ds('roundedCorners', 'none')],
    },
};

export const Portrait = {
    args: {
        ...base,
        data: { __typename: 'Image', AltText: 'Portrait oriented photo', Image: mockImageRef(IMAGES.portrait) },
        displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'default'), ds('orientation', 'portrait'), ds('roundedCorners', 'none')],
    },
};

// ── Rounded corners ───────────────────────────────────────────────────────

export const RoundedNone    = { args: { ...base, data: { __typename: 'Image', AltText: 'No rounding',      Image: mockImageRef(IMAGES.landscape) }, displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'widescreen'), ds('roundedCorners', 'none')] } };
export const RoundedSmall   = { args: { ...base, data: { __typename: 'Image', AltText: 'Small rounding',   Image: mockImageRef(IMAGES.landscape) }, displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'widescreen'), ds('roundedCorners', 'small')] } };
export const RoundedMedium  = { args: { ...base, data: { __typename: 'Image', AltText: 'Medium rounding',  Image: mockImageRef(IMAGES.landscape) }, displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'widescreen'), ds('roundedCorners', 'medium')] } };
export const RoundedLarge   = { args: { ...base, data: { __typename: 'Image', AltText: 'Large rounding',   Image: mockImageRef(IMAGES.landscape) }, displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'widescreen'), ds('roundedCorners', 'large')] } };
export const RoundedXLarge  = { args: { ...base, data: { __typename: 'Image', AltText: 'XL rounding',      Image: mockImageRef(IMAGES.landscape) }, displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'widescreen'), ds('roundedCorners', 'xlarge')] } };
export const Rounded3XLarge = { args: { ...base, data: { __typename: 'Image', AltText: '3XL rounding',     Image: mockImageRef(IMAGES.landscape) }, displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'widescreen'), ds('roundedCorners', 'x3large')] } };
export const RoundedHuge    = { args: { ...base, data: { __typename: 'Image', AltText: 'Huge rounding',    Image: mockImageRef(IMAGES.landscape) }, displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'widescreen'), ds('roundedCorners', 'huge')] } };
export const RoundedXHuge   = { args: { ...base, data: { __typename: 'Image', AltText: 'X-Huge rounding',  Image: mockImageRef(IMAGES.landscape) }, displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'widescreen'), ds('roundedCorners', 'xhuge')] } };
export const RoundedFull    = { args: { ...base, data: { __typename: 'Image', AltText: 'Profile photo',    Image: mockImageRef(IMAGES.portrait)  }, displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'square'),    ds('roundedCorners', 'full')] } };

// ── Icons — sizes ─────────────────────────────────────────────────────────

export const IconXS   = { args: { ...base, data: { __typename: 'Image', AltText: 'XS icon',   Image: mockImageRef(IMAGES.abstract) }, displaySettings: [ds('displayAs', 'icon'), ds('iconSize', 'xs'),   ds('iconShape', 'circle')] } };
export const IconSM   = { args: { ...base, data: { __typename: 'Image', AltText: 'SM icon',   Image: mockImageRef(IMAGES.abstract) }, displaySettings: [ds('displayAs', 'icon'), ds('iconSize', 'sm'),   ds('iconShape', 'circle')] } };
export const IconMD   = { args: { ...base, data: { __typename: 'Image', AltText: 'MD icon',   Image: mockImageRef(IMAGES.abstract) }, displaySettings: [ds('displayAs', 'icon'), ds('iconSize', 'md'),   ds('iconShape', 'circle')] } };
export const IconLG   = { args: { ...base, data: { __typename: 'Image', AltText: 'LG icon',   Image: mockImageRef(IMAGES.abstract) }, displaySettings: [ds('displayAs', 'icon'), ds('iconSize', 'lg'),   ds('iconShape', 'circle')] } };
export const IconXL   = { args: { ...base, data: { __typename: 'Image', AltText: 'XL icon',   Image: mockImageRef(IMAGES.office)   }, displaySettings: [ds('displayAs', 'icon'), ds('iconSize', 'xl'),   ds('iconShape', 'rounded')] } };
export const IconXXL  = { args: { ...base, data: { __typename: 'Image', AltText: 'XXL icon',  Image: mockImageRef(IMAGES.office)   }, displaySettings: [ds('displayAs', 'icon'), ds('iconSize', 'xxl'),  ds('iconShape', 'rounded')] } };
export const IconXXXL = { args: { ...base, data: { __typename: 'Image', AltText: 'XXXL icon', Image: mockImageRef(IMAGES.office)   }, displaySettings: [ds('displayAs', 'icon'), ds('iconSize', 'xxxl'), ds('iconShape', 'rounded')] } };

// ── Icons — shapes ────────────────────────────────────────────────────────

export const IconShapeNone    = { args: { ...base, data: { __typename: 'Image', AltText: 'Icon no shape',  Image: mockImageRef(IMAGES.abstract) }, displaySettings: [ds('displayAs', 'icon'), ds('iconSize', 'xl'), ds('iconShape', 'none')] } };
export const IconShapeRounded = { args: { ...base, data: { __typename: 'Image', AltText: 'Icon rounded',   Image: mockImageRef(IMAGES.abstract) }, displaySettings: [ds('displayAs', 'icon'), ds('iconSize', 'xl'), ds('iconShape', 'rounded')] } };
export const IconShapeCircle  = { args: { ...base, data: { __typename: 'Image', AltText: 'Icon circle',    Image: mockImageRef(IMAGES.abstract) }, displaySettings: [ds('displayAs', 'icon'), ds('iconSize', 'xl'), ds('iconShape', 'circle')] } };
export const IconShapeSquare  = { args: { ...base, data: { __typename: 'Image', AltText: 'Icon square',    Image: mockImageRef(IMAGES.abstract) }, displaySettings: [ds('displayAs', 'icon'), ds('iconSize', 'xl'), ds('iconShape', 'square')] } };
