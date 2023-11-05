<script>
	export let article;

	let urlcomment = `https://news.ycombinator.com/item?id=${article.id}`;
	let url = article.url.startsWith("http") ? article.url : urlcomment;
</script>

<div class="flex-container">
	<a class="main" href={url} target="_blank">
		<div class="title">{article.title}</div>
		<div class="metadata">
			{article.time_ago} - {article.points} points
		</div>
		<div class="url">{url}</div>
	</a>
	<a class="comment" href={urlcomment} target="_blank">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
			/>
		</svg>
		{article.comments_count}
	</a>
</div>

<style>
	.flex-container {
		display: flex;
		align-items: stretch;
		background-color: #eee;
		border: 1px solid #ccc;
		margin-bottom: 1rem;
	}
	a {
		padding: 1rem 0.4rem;
		text-decoration: none;
		color: inherit;
	}
	a:hover {
		background-color: azure;
	}
	a .title {
		font-weight: bold;
	}
	a.main {
		flex-grow: 2;
		min-width: 0;
	}
	a.comment {
		align-items: center;
		display: flex;
		flex-direction: column;
		max-width: 5rem;
		font-size: 0.6em;
	}
	.url {
		font-style: italic;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	svg {
		width: 3em;
	}
</style>
