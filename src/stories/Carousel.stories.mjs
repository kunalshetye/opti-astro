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
