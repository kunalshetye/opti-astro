import CarouselComponent from '../cms/components/CarouselComponent/Carousel.astro';
import { ds, IMAGES, mockLink, mockPayload } from './_mocks.ts';

export default {
    component: CarouselComponent,
};

const assets = [
    { __typename: 'Link', title: 'Modern architecture', url: { __typename: 'ContentUrl', default: IMAGES.landscape } },
    { __typename: 'Link', title: 'Office space', url: { __typename: 'ContentUrl', default: IMAGES.office } },
    { __typename: 'Link', title: 'Abstract forms', url: { __typename: 'ContentUrl', default: IMAGES.abstract } },
    { __typename: 'Link', title: 'Forest path', url: { __typename: 'ContentUrl', default: IMAGES.nature } },
    { __typename: 'Link', title: 'City skyline', url: { __typename: 'ContentUrl', default: IMAGES.city } },
];

const base = { key: 'carousel', contentPayload: mockPayload };

// ── Carousel mode ─────────────────────────────────────────────────────────

export const Default = {
    args: {
        ...base,
        data: { __typename: 'Carousel', Heading: 'Featured gallery', Link: mockLink('View all', '/gallery'), Assets: assets },
        displayTemplateKey: 'DefaultCarousel',
        displaySettings: [
            ds('carouselMode', 'standard'),
            ds('itemsPerViewDesktop', 'items3'),
            ds('itemsPerViewTablet', 'items2'),
            ds('itemsPerViewMobile', 'items1'),
            ds('spaceBetween', 'space24'),
            ds('showNavigation', 'true'),
            ds('showPagination', 'true'),
            ds('autoplay', 'false'),
            ds('loop', 'true'),
            ds('carousel_height', 'h_80'),
            ds('image_fit', 'object_cover'),
            ds('carousel_alignment', 'full_width'),
        ],
    },
};

export const ContentMode = {
    args: {
        ...base,
        data: { __typename: 'Carousel', Heading: 'Content carousel', Link: null, Assets: assets },
        displayTemplateKey: 'DefaultCarousel',
        displaySettings: [
            ds('carouselMode', 'content'),
            ds('itemsPerViewDesktop', 'items3'),
            ds('itemsPerViewTablet', 'items2'),
            ds('itemsPerViewMobile', 'items1'),
            ds('spaceBetween', 'space24'),
            ds('showNavigation', 'true'),
            ds('showPagination', 'true'),
            ds('autoplay', 'false'),
            ds('loop', 'true'),
            ds('carousel_height', 'h_80'),
            ds('image_fit', 'object_cover'),
            ds('carousel_alignment', 'full_width'),
        ],
    },
};

// ── Items per view ────────────────────────────────────────────────────────

export const TwoItemsTall = {
    args: {
        ...base,
        data: { __typename: 'Carousel', Heading: null, Link: null, Assets: assets.slice(0, 3) },
        displayTemplateKey: 'DefaultCarousel',
        displaySettings: [
            ds('carouselMode', 'standard'),
            ds('itemsPerViewDesktop', 'items2'),
            ds('itemsPerViewTablet', 'items1'),
            ds('itemsPerViewMobile', 'items1'),
            ds('spaceBetween', 'space32'),
            ds('showNavigation', 'true'),
            ds('showPagination', 'false'),
            ds('autoplay', 'true'),
            ds('autoplayDelay', 'delay5s'),
            ds('loop', 'true'),
            ds('carousel_height', 'h_112'),
            ds('image_fit', 'object_cover'),
            ds('carousel_alignment', 'centered_large'),
        ],
    },
};

export const FourItems = {
    args: {
        ...base,
        data: { __typename: 'Carousel', Heading: 'Our portfolio', Link: mockLink('See all projects', '/portfolio'), Assets: assets },
        displayTemplateKey: 'DefaultCarousel',
        displaySettings: [
            ds('carouselMode', 'standard'),
            ds('itemsPerViewDesktop', 'items4'),
            ds('itemsPerViewTablet', 'items2'),
            ds('itemsPerViewMobile', 'items1'),
            ds('spaceBetween', 'space16'),
            ds('showNavigation', 'true'),
            ds('showPagination', 'true'),
            ds('loop', 'false'),
            ds('carousel_height', 'h_64'),
            ds('image_fit', 'object_cover'),
        ],
    },
};

export const FiveItems = {
    args: {
        ...base,
        data: { __typename: 'Carousel', Heading: 'Five-item showcase', Link: null, Assets: assets },
        displayTemplateKey: 'DefaultCarousel',
        displaySettings: [
            ds('carouselMode', 'standard'),
            ds('itemsPerViewDesktop', 'items5'),
            ds('itemsPerViewTablet', 'items3'),
            ds('itemsPerViewMobile', 'items2'),
            ds('spaceBetween', 'space16'),
            ds('showNavigation', 'true'),
            ds('showPagination', 'false'),
            ds('loop', 'true'),
            ds('carousel_height', 'h_64'),
            ds('image_fit', 'object_cover'),
            ds('carousel_alignment', 'full_width'),
        ],
    },
};

// ── Heights ───────────────────────────────────────────────────────────────

export const HeightAuto = {
    args: {
        ...base,
        data: { __typename: 'Carousel', Heading: 'Auto height', Link: null, Assets: assets.slice(0, 3) },
        displayTemplateKey: 'DefaultCarousel',
        displaySettings: [
            ds('carouselMode', 'standard'),
            ds('itemsPerViewDesktop', 'items3'),
            ds('itemsPerViewTablet', 'items2'),
            ds('itemsPerViewMobile', 'items1'),
            ds('spaceBetween', 'space24'),
            ds('showNavigation', 'true'),
            ds('showPagination', 'false'),
            ds('loop', 'false'),
            ds('carousel_height', 'h_auto'),
            ds('image_fit', 'object_cover'),
        ],
    },
};

export const HeightLarge = {
    args: {
        ...base,
        data: { __typename: 'Carousel', Heading: 'Large height (24rem)', Link: null, Assets: assets },
        displayTemplateKey: 'DefaultCarousel',
        displaySettings: [
            ds('carouselMode', 'standard'),
            ds('itemsPerViewDesktop', 'items3'),
            ds('itemsPerViewTablet', 'items2'),
            ds('itemsPerViewMobile', 'items1'),
            ds('spaceBetween', 'space24'),
            ds('showNavigation', 'true'),
            ds('showPagination', 'true'),
            ds('loop', 'true'),
            ds('carousel_height', 'h_96'),
            ds('image_fit', 'object_cover'),
            ds('carousel_alignment', 'full_width'),
        ],
    },
};

export const HeightXXL = {
    args: {
        ...base,
        data: { __typename: 'Carousel', Heading: 'XX-Large height (32rem)', Link: null, Assets: assets },
        displayTemplateKey: 'DefaultCarousel',
        displaySettings: [
            ds('carouselMode', 'standard'),
            ds('itemsPerViewDesktop', 'items2'),
            ds('itemsPerViewTablet', 'items1'),
            ds('itemsPerViewMobile', 'items1'),
            ds('spaceBetween', 'space32'),
            ds('showNavigation', 'true'),
            ds('showPagination', 'true'),
            ds('loop', 'true'),
            ds('carousel_height', 'h_128'),
            ds('image_fit', 'object_cover'),
            ds('carousel_alignment', 'centered_large'),
        ],
    },
};

export const HeightXXXL = {
    args: {
        ...base,
        data: { __typename: 'Carousel', Heading: 'XXX-Large height (36rem)', Link: null, Assets: assets },
        displayTemplateKey: 'DefaultCarousel',
        displaySettings: [
            ds('carouselMode', 'standard'),
            ds('itemsPerViewDesktop', 'items2'),
            ds('itemsPerViewTablet', 'items1'),
            ds('itemsPerViewMobile', 'items1'),
            ds('spaceBetween', 'space32'),
            ds('showNavigation', 'true'),
            ds('showPagination', 'false'),
            ds('loop', 'true'),
            ds('carousel_height', 'h_144'),
            ds('image_fit', 'object_cover'),
            ds('carousel_alignment', 'full_width'),
        ],
    },
};

export const HeightFullScreen = {
    args: {
        ...base,
        data: { __typename: 'Carousel', Heading: 'Full screen height', Link: null, Assets: assets },
        displayTemplateKey: 'DefaultCarousel',
        displaySettings: [
            ds('carouselMode', 'standard'),
            ds('itemsPerViewDesktop', 'items1'),
            ds('itemsPerViewTablet', 'items1'),
            ds('itemsPerViewMobile', 'items1'),
            ds('spaceBetween', 'space16'),
            ds('showNavigation', 'true'),
            ds('showPagination', 'true'),
            ds('autoplay', 'true'),
            ds('autoplayDelay', 'delay5s'),
            ds('loop', 'true'),
            ds('carousel_height', 'h_screen'),
            ds('image_fit', 'object_cover'),
            ds('carousel_alignment', 'full_width'),
        ],
    },
};

// ── Image fit ─────────────────────────────────────────────────────────────

export const ImageFitCover = {
    args: {
        ...base,
        data: { __typename: 'Carousel', Heading: 'Image cover fit', Link: null, Assets: assets.slice(0, 3) },
        displayTemplateKey: 'DefaultCarousel',
        displaySettings: [
            ds('carouselMode', 'standard'),
            ds('itemsPerViewDesktop', 'items3'),
            ds('itemsPerViewTablet', 'items2'),
            ds('itemsPerViewMobile', 'items1'),
            ds('spaceBetween', 'space24'),
            ds('showNavigation', 'true'),
            ds('showPagination', 'false'),
            ds('loop', 'true'),
            ds('carousel_height', 'h_80'),
            ds('image_fit', 'object_cover'),
        ],
    },
};

export const ImageFitContain = {
    args: {
        ...base,
        data: { __typename: 'Carousel', Heading: 'Image contain fit', Link: null, Assets: assets.slice(0, 3) },
        displayTemplateKey: 'DefaultCarousel',
        displaySettings: [
            ds('carouselMode', 'standard'),
            ds('itemsPerViewDesktop', 'items3'),
            ds('itemsPerViewTablet', 'items2'),
            ds('itemsPerViewMobile', 'items1'),
            ds('spaceBetween', 'space24'),
            ds('showNavigation', 'true'),
            ds('showPagination', 'false'),
            ds('loop', 'true'),
            ds('carousel_height', 'h_80'),
            ds('image_fit', 'object_contain'),
        ],
    },
};

export const ImageFitFill = {
    args: {
        ...base,
        data: { __typename: 'Carousel', Heading: 'Image fill fit', Link: null, Assets: assets.slice(0, 3) },
        displayTemplateKey: 'DefaultCarousel',
        displaySettings: [
            ds('carouselMode', 'standard'),
            ds('itemsPerViewDesktop', 'items3'),
            ds('itemsPerViewTablet', 'items2'),
            ds('itemsPerViewMobile', 'items1'),
            ds('spaceBetween', 'space24'),
            ds('showNavigation', 'true'),
            ds('showPagination', 'false'),
            ds('loop', 'true'),
            ds('carousel_height', 'h_80'),
            ds('image_fit', 'object_fill'),
        ],
    },
};

// ── Alignment ─────────────────────────────────────────────────────────────

export const AlignFullWidth     = { args: { ...base, data: { __typename: 'Carousel', Heading: 'Full width alignment',      Link: null, Assets: assets }, displayTemplateKey: 'DefaultCarousel', displaySettings: [ds('carouselMode', 'standard'), ds('itemsPerViewDesktop', 'items3'), ds('itemsPerViewTablet', 'items2'), ds('itemsPerViewMobile', 'items1'), ds('spaceBetween', 'space24'), ds('showNavigation', 'true'), ds('showPagination', 'true'), ds('loop', 'true'), ds('carousel_height', 'h_80'), ds('image_fit', 'object_cover'), ds('carousel_alignment', 'full_width')] } };
export const AlignCenteredLarge  = { args: { ...base, data: { __typename: 'Carousel', Heading: 'Centered large alignment',   Link: null, Assets: assets }, displayTemplateKey: 'DefaultCarousel', displaySettings: [ds('carouselMode', 'standard'), ds('itemsPerViewDesktop', 'items3'), ds('itemsPerViewTablet', 'items2'), ds('itemsPerViewMobile', 'items1'), ds('spaceBetween', 'space24'), ds('showNavigation', 'true'), ds('showPagination', 'true'), ds('loop', 'true'), ds('carousel_height', 'h_80'), ds('image_fit', 'object_cover'), ds('carousel_alignment', 'centered_large')] } };
export const AlignCenteredMedium = { args: { ...base, data: { __typename: 'Carousel', Heading: 'Centered medium alignment',  Link: null, Assets: assets }, displayTemplateKey: 'DefaultCarousel', displaySettings: [ds('carouselMode', 'standard'), ds('itemsPerViewDesktop', 'items3'), ds('itemsPerViewTablet', 'items2'), ds('itemsPerViewMobile', 'items1'), ds('spaceBetween', 'space24'), ds('showNavigation', 'true'), ds('showPagination', 'true'), ds('loop', 'true'), ds('carousel_height', 'h_80'), ds('image_fit', 'object_cover'), ds('carousel_alignment', 'centered_medium')] } };
export const AlignCenteredSmall  = { args: { ...base, data: { __typename: 'Carousel', Heading: 'Centered small alignment',   Link: null, Assets: assets }, displayTemplateKey: 'DefaultCarousel', displaySettings: [ds('carouselMode', 'standard'), ds('itemsPerViewDesktop', 'items3'), ds('itemsPerViewTablet', 'items2'), ds('itemsPerViewMobile', 'items1'), ds('spaceBetween', 'space24'), ds('showNavigation', 'true'), ds('showPagination', 'true'), ds('loop', 'true'), ds('carousel_height', 'h_80'), ds('image_fit', 'object_cover'), ds('carousel_alignment', 'centered_small')] } };

// ── Autoplay delays ───────────────────────────────────────────────────────

export const AutoplayDelay3s  = { args: { ...base, data: { __typename: 'Carousel', Heading: 'Autoplay 3s',  Link: null, Assets: assets }, displayTemplateKey: 'DefaultCarousel', displaySettings: [ds('carouselMode', 'standard'), ds('itemsPerViewDesktop', 'items3'), ds('itemsPerViewTablet', 'items2'), ds('itemsPerViewMobile', 'items1'), ds('spaceBetween', 'space24'), ds('showNavigation', 'true'), ds('showPagination', 'true'), ds('autoplay', 'true'), ds('autoplayDelay', 'delay3s'),  ds('loop', 'true'), ds('carousel_height', 'h_80'), ds('image_fit', 'object_cover'), ds('carousel_alignment', 'full_width')] } };
export const AutoplayDelay5s  = { args: { ...base, data: { __typename: 'Carousel', Heading: 'Autoplay 5s',  Link: null, Assets: assets }, displayTemplateKey: 'DefaultCarousel', displaySettings: [ds('carouselMode', 'standard'), ds('itemsPerViewDesktop', 'items3'), ds('itemsPerViewTablet', 'items2'), ds('itemsPerViewMobile', 'items1'), ds('spaceBetween', 'space24'), ds('showNavigation', 'true'), ds('showPagination', 'true'), ds('autoplay', 'true'), ds('autoplayDelay', 'delay5s'),  ds('loop', 'true'), ds('carousel_height', 'h_80'), ds('image_fit', 'object_cover'), ds('carousel_alignment', 'full_width')] } };
export const AutoplayDelay7s  = { args: { ...base, data: { __typename: 'Carousel', Heading: 'Autoplay 7s',  Link: null, Assets: assets }, displayTemplateKey: 'DefaultCarousel', displaySettings: [ds('carouselMode', 'standard'), ds('itemsPerViewDesktop', 'items3'), ds('itemsPerViewTablet', 'items2'), ds('itemsPerViewMobile', 'items1'), ds('spaceBetween', 'space24'), ds('showNavigation', 'true'), ds('showPagination', 'true'), ds('autoplay', 'true'), ds('autoplayDelay', 'delay7s'),  ds('loop', 'true'), ds('carousel_height', 'h_80'), ds('image_fit', 'object_cover'), ds('carousel_alignment', 'full_width')] } };
export const AutoplayDelay10s = { args: { ...base, data: { __typename: 'Carousel', Heading: 'Autoplay 10s', Link: null, Assets: assets }, displayTemplateKey: 'DefaultCarousel', displaySettings: [ds('carouselMode', 'standard'), ds('itemsPerViewDesktop', 'items3'), ds('itemsPerViewTablet', 'items2'), ds('itemsPerViewMobile', 'items1'), ds('spaceBetween', 'space24'), ds('showNavigation', 'true'), ds('showPagination', 'true'), ds('autoplay', 'true'), ds('autoplayDelay', 'delay10s'), ds('loop', 'true'), ds('carousel_height', 'h_80'), ds('image_fit', 'object_cover'), ds('carousel_alignment', 'full_width')] } };
