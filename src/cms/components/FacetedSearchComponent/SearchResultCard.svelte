<script lang="ts">
    import {
        formatDate,
        getTitle,
        getContentExcerpt,
        isExperience,
        getImageUrl,
        getImageAlt,
        getPlaceholderGradient
    } from './lib/searchResultHelpers';

    interface Props {
        result: any;
        locale: string;
        viewMode?: 'list' | 'grid';
        onClick?: (result: any) => void;
    }

    let { result, locale, viewMode = 'list', onClick }: Props = $props();

    const imageUrl = getImageUrl(result);
    const imageAlt = getImageAlt(result);
    const placeholderGradient = getPlaceholderGradient(result);

    const isPinnedResult = result._score >= 20000;

    function handleClick(event: Event) {
        if (onClick) {
            event.preventDefault();
            onClick(result);
        }
    }
</script>

{#if viewMode === 'grid'}
    <!-- Grid View: Vertical card with image on top -->
    <article
        class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow h-full"
        class:pinned={isPinnedResult}
        class:pinned--grid={isPinnedResult}
    >
        <!-- Image Section -->
        <figure class="aspect-video w-full overflow-hidden">
            {#if imageUrl}
				<img src={imageUrl} alt={imageAlt} class="w-full h-full object-cover" />
            {:else}
				<div class="w-full h-full flex items-center justify-center {placeholderGradient}">
                    <svg
                        class="w-16 h-16 text-base-content/20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>
            {/if}
        </figure>

        <!-- Content Section -->
        <div class="card-body p-4">
            <h2 class="card-title text-base">
				<a href={result._metadata.url.hierarchical} class="hover:text-primary line-clamp-2" onclick={handleClick}>
                    {getTitle(result)}
                </a>
            </h2>

            <div class="flex items-center gap-2 text-xs text-base-content/60">
                {#if result._metadata.published}
					<span>{formatDate(result._metadata.published, locale)}</span>
                {/if}
                {#if !isExperience(result) && result.Author}
                    <span>•</span>
                    <span>{result.Author}</span>
                {/if}
            </div>

            {#if getContentExcerpt(result)}
				<p class="text-sm text-base-content/70 line-clamp-3">{getContentExcerpt(result)}</p>
            {/if}

            <div class="card-actions justify-end mt-auto">
				<a href={result._metadata.url.hierarchical} class="btn btn-primary btn-sm" onclick={handleClick}>
                    Read more
                </a>
            </div>
        </div>
    </article>
{:else}
    <!-- List View: Horizontal card with image on left -->
    <article
        class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
        class:pinned={isPinnedResult}
    >
        <div class="card-body md:flex-row md:items-start gap-4 p-4">
            <!-- Image Section (desktop: left side, mobile: top) -->
            {#if imageUrl}
				<figure class="flex-shrink-0 w-full md:w-48 h-36 overflow-hidden rounded-lg">
					<img src={imageUrl} alt={imageAlt} class="w-full h-full object-cover" />
                </figure>
            {:else}
                <div
                    class="flex-shrink-0 w-full md:w-48 h-36 rounded-lg flex items-center justify-center {placeholderGradient}"
                >
					<svg class="w-12 h-12 text-base-content/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>
            {/if}

            <!-- Content Section -->
            <div class="flex-1 min-w-0">
                <h2 class="card-title text-lg mb-2">
					<a href={result._metadata.url.hierarchical} class="hover:text-primary" onclick={handleClick}>
                        {getTitle(result)}
                    </a>
                </h2>

                {#if !isExperience(result) && result.SubHeading}
                    <p class="text-base-content/70 mb-2">{result.SubHeading}</p>
                {/if}

				<div class="flex items-center gap-4 text-sm text-base-content/60 mb-3">
                    {#if !isExperience(result) && result.Author}
                        <span>By {result.Author}</span>
                    {/if}
                    {#if result._metadata.published}
						<span>{formatDate(result._metadata.published, locale)}</span>
                    {/if}
                </div>

                {#if getContentExcerpt(result)}
                    <p class="text-sm text-base-content/70 mb-4 line-clamp-3">
                        {getContentExcerpt(result)}
                    </p>
                {/if}

                <div class="card-actions">
					<a href={result._metadata.url.hierarchical} class="btn btn-primary btn-sm" onclick={handleClick}>
                        Read more
                    </a>
                </div>
            </div>
        </div>
    </article>
{/if}

<style>
    .pinned {
        border: 2px solid var(--color-primary);
        background-color: #9b9b9b1a;
        position: relative;
        padding: 1rem;
    }
    .pinned::after {
        content: 'Best Bet';
        position: absolute;
        text-transform: uppercase;
        color: var(--color-primary);
        font-size: smaller;
        right: 1rem;
        top: 1rem;
    }
    .pinned--grid {
        padding: revert;
    }
    .pinned--grid::after {
        left: 1rem;
        bottom: 1rem;
        top: auto;
        right: auto;
    }
</style>
