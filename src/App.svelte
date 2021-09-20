{#if news}
  <main>
    <header>
      <section>
        <h1> <i class="icono-infinity" /> HN Reader <span>at {lasttime}</span> </h1>
      </section>
      <section class="toolbar">
        {#each tags as t} 
          <button on:click={() => changetag(t)} class:active={t==tag}>{t}</button> 
        {/each} 
      </section>
    </header>
    <section>
      {#each news as item (item.id)}
        <NewsItem {item} />
      {/each}
    </section>
    <footer>
      <section>
        <div class="toolbar">
          <span>
            Page {page}
            <button on:click={prev}> <i class="icono-caretLeft" /> </button>
            <button on:click={next}> <i class="icono-caretRight" /> </button>
            <button on:click={reload}> <i class="icono-reset" /> </button>
          </span>
        </div>
      </section>
    </footer>
  </main>
{/if}

<script>
  import NewsItem from "./NewsItem.svelte";

  let news;
  let tag = 'news';
  let tags = ['news', 'ask', 'newest', 'show', 'jobs', 'best'];
  let page = 1;
  let last = new Date();

  $: lasttime = last.toLocaleDateString() + " " + last.toLocaleTimeString();

  function getpage(page) {
    news = [];
    var url = `https://node-hnapi.herokuapp.com/` + tag + `?page=` + page;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        news = data;
      });
    last = new Date();
  }
  function changetag(t) {
    tag = t;
    reload();
  }
  function next() {
    page++;
  }
  function prev() {
    if (page > 1) {
      page--;
    }
  }
  function reload() {
    page = 1;
    getpage(page);
  }

  $: getpage(page);
</script>

<style>
  main {
    max-width: 1024px;
    width: 100%;
    margin: 0 auto;
  }
  header, footer {
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
  header section.toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  header > section > h1 > span {
    font-weight:normal;
    font-size: 0.8rem;
  }
  header > section > a {
    text-decoration: none;
    margin-right: 1em;
  }
  header > section > a.on {
    background-color: #0000EE;
  }
  footer > section i {
    cursor: pointer;
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
    color: #d9d872;
    padding: 16px 10px;
    cursor: pointer;
  }
  button:active, button.active {
    background-color: var(--bg-color);
    color: var(--text-color);
  }
</style>
