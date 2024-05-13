<svelte:options customElement="hacker-news" />

<script>
	import Article from "./article.svelte";

	let news;
	let tag = "news";
	let tags = ["news", "ask", "newest", "best"];  // tags to show
	let filtered = ["YC S", "YC W", "Launch HN" ]; // word to filter from article title results
	let page = 1;
	let last = new Date();

	$: lasttime = last.toLocaleTimeString();

	let getpage = (page) => {
		news = [];
		var url = `https://node-hnapi.herokuapp.com/` + tag + `?page=` + page;
		fetch(url)
			.then((r) => r.json())
			.then((data) => {
				news = data.filter((item) => {
					let f = filtered.filter( (word) => {
						return item.title.includes(word); 
					} );
					return ( f.length == 0 );
				});
			});
		last = new Date();
	};
	let changetag = (t) => {
		tag = t;
		reload();
	};
	let next = () => page++;
	let prev = () => {
		if (page > 1) {
			page--;
		}
	};
	let reload = () => {
		page = 1;
		getpage(page);
	};

	$: getpage(page);
</script>

{#if news}
	<main>
		<header>
			<section>
				<h1>
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
							d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
						/>
					</svg>
					HN Reader
				</h1>
				<span>at {lasttime}</span>
			</section>
			<section class="toolbar">
				{#each tags as t}
					<button
						on:click={() => changetag(t)}
						class:active={t == tag}>{t}</button
					>
				{/each}
			</section>
		</header>
		<section>
			{#each news as article (article.id)}
				<Article {article} />
			{/each}
		</section>
		<footer>
			<section>
				<div class="toolbar">
					<span>
						Page {page}
						<button on:click={reload}>
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
									d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
								/>
							</svg>
						</button>
						<button on:click={prev}>
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
									d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
								/>
							</svg>
						</button>
						<button on:click={next}>
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
									d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
								/>
							</svg>
						</button>
					</span>
				</div>
			</section>
		</footer>
	</main>
{/if}

<style>
	svg {
		width: 1em;
		height: 1em;
		cursor: pointer;
	}
	main {
		max-width: 1024px;
		width: 100%;
		margin: 0 auto;
	}
	header,
	footer {
		max-width: 1024px;
		width: 100%;
		position: sticky;
		background-color: #fff;
		z-index: 9999;
	}
	header {
		top: 0;
	}
	footer {
		bottom: 0;
	}
	section.toolbar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	header section {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	header h1 {
		font-size: 1.5rem;
		padding: 0;
		margin: 1rem 0.5rem;
	}
	header h1 span {
		font-weight: normal;
		font-size: 0.8em;
	}
	header span {
		margin: 1rem 0.5rem;
	}
	footer > section > .toolbar {
		display: flex;
		justify-content: end;
		align-items: center;
	}
	main > section {
		padding: 1.5rem 0;
	}
	button {
		border: 0;
		background-color: #454d66;
		color: #fff;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-size: 1.25rem;
	}
	footer button {
		line-height: 0;
	}
	button.active {
		background-color: var(--bg-color);
		color: var(--text-color);
	}
</style>
