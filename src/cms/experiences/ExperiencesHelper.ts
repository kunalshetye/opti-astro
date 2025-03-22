import type { Locales } from 'astro';
import type { BlankExperience } from '../../../__generated/sdk';
import { getOptimizelySdk } from '../../graphql/getSdk';
import type { ContentPayload } from '../../graphql/shared/ContentPayload';

export async function getSeoData(
    isExperienceType: boolean,
    isPageType: boolean,
    previewPayload: ContentPayload
) {
    let metaTitle: string = '',
        metaDescription: string = '';

    if (isExperienceType || isPageType) {
        const metaResponse = await getOptimizelySdk(
            previewPayload
        ).getExperienceSeo({
            key: previewPayload.key,
            ver: previewPayload.ver,
            // @ts-ignore
            loc: previewPayload.loc as unknown as Locales,
        });
        if (
            metaResponse?._Experience?.item?._metadata?.types?.includes(
                'BlankExperience'
            )
        ) {
            const blankExperience = metaResponse?._Experience
                ?.item as BlankExperience;
            metaTitle =
                blankExperience?.BlankExperienceSeoSettings?.MetaTitle || '';
            metaDescription =
                blankExperience?.BlankExperienceSeoSettings?.MetaDescription ||
                '';
        }
    }
    return { metaTitle, metaDescription };
}
