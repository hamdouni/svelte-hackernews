<script>
  import NewsItem from "./NewsItem.svelte";

  let news;
  let page = 1;
  let last = new Date();

  $: lasttime = last.toLocaleDateString() + " " + last.toLocaleTimeString();

  function getpage(page) {
    news = [];
    fetch(`https://node-hnapi.herokuapp.com/news?page=` + page)
      .then(r => r.json())
      .then(data => {
        news = data;
      });
    last = new Date();
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
    position: fixed;
    background-color: #fff;
    z-index: 9999;
  }
  header {
    top: 0;
  }
  footer {
    bottom: 0;
  }
  header > section > h1 {
    margin:10px;
  }
  header > section > h1 > span {
    font-weight:normal;
    font-size: 0.8rem;
  }
  footer > section i {
    cursor: pointer;
  }
  footer > section > .toolbar {
    display: flex;
    justify-content: end;
    align-items: center;
    margin: 10px;
  }
  main > section {
    padding: 3.5rem 0;
  }
  button {
    border: 0;
    background-color: #454d66;
    color: #d9d872;
    padding: 4px;
    cursor: pointer;
  }
  button:active {
    background-color: #009975;
    color: #58b368;
    cursor: wait;
  }
</style>

{#if news}
  <main>
    <header>
      <section>
        <h1>
          <i class="icono-infinity" />
          HN Reader
          <span>at {lasttime}</span>
        </h1>
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
            <button on:click={prev}>
              <i class="icono-caretLeft" />
            </button>
            <button on:click={next}>
              <i class="icono-caretRight" />
            </button>
            <button on:click={reload}>
              <i class="icono-reset" />
            </button>
          </span>
        </div>
      </section>
    </footer>
  </main>
{/if}
