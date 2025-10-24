<script lang="ts">
	import { formatDate, getTitle, getContentExcerpt, isExperience } from './lib/searchResultHelpers';

	interface Props {
		result: any;
		locale: string;
	}

	let { result, locale }: Props = $props();
</script>

<article class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
	<div class="card-body">
		<h2 class="card-title">
			<a href={result._metadata.url.hierarchical} class="hover:text-primary">
				{getTitle(result)}
			</a>
		</h2>
		{#if !isExperience(result) && result.SubHeading}
			<p class="text-base-content/70">{result.SubHeading}</p>
		{/if}
		<div class="flex items-center gap-4 text-sm text-base-content/60">
			{#if !isExperience(result) && result.Author}
				<span>By {result.Author}</span>
			{/if}
			{#if result._metadata.published}
				<span>{formatDate(result._metadata.published, locale)}</span>
			{/if}
		</div>
		{#if getContentExcerpt(result)}
			<p class="text-sm">{getContentExcerpt(result)}</p>
		{/if}
		<div class="card-actions justify-end">
			<a href={result._metadata.url.hierarchical} class="btn btn-primary btn-sm">
				Read more
			</a>
		</div>
	</div>
</article>
