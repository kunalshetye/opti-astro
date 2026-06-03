import ImageComponent from '../cms/components/ImageComponent/Image.astro';
import { ds, IMAGES, mockImageRef, mockPayload } from './_mocks.ts';

export default {
    component: ImageComponent,
};

const base = { key: 'image', contentPayload: mockPayload };

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

export const IconMedium = {
    args: {
        ...base,
        data: { __typename: 'Image', AltText: 'Feature icon', Image: mockImageRef(IMAGES.abstract) },
        displaySettings: [ds('displayAs', 'icon'), ds('iconSize', 'md'), ds('iconShape', 'circle')],
    },
};

export const IconLarge = {
    args: {
        ...base,
        data: { __typename: 'Image', AltText: 'Brand icon', Image: mockImageRef(IMAGES.office) },
        displaySettings: [ds('displayAs', 'icon'), ds('iconSize', 'xl'), ds('iconShape', 'rounded')],
    },
};

export const RoundedFull = {
    args: {
        ...base,
        data: { __typename: 'Image', AltText: 'Profile photo', Image: mockImageRef(IMAGES.portrait) },
        displaySettings: [ds('displayAs', 'image'), ds('aspectRatio', 'square'), ds('roundedCorners', 'full')],
    },
};
