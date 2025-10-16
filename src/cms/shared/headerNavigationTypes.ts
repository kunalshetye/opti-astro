// Shared type definitions for navigation components

export interface LinkType {
    text: string;
    url: {
        default: string;
    };
}

export interface MenuItemType {
    Link: LinkType;
    LinkText?: string;
    SubMenuItems?: MenuItemType[];
}
