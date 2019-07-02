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
  header {
    max-width: 1024px;
    width: 100%;
    position: fixed;
    top: 0;
    background-color: #fff;
    z-index: 9999;
  }
  header > section {
    padding: 1rem;
  }
  header > section > h1 > span {
    font-weight:normal;
    font-size: 0.8rem;
  }
  header > section i {
    cursor: pointer;
  }
  header > section > .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  main > section {
    padding-top: 8.5rem;
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
        <div class="toolbar">
          <span>
            Page {page}
            <button on:click={prev}>
              <i class="icono-caretLeft" />
            </button>
            <button on:click={next}>
              <i class="icono-caretRight" />
            </button>
          </span>
          <button on:click={reload}>
            <i class="icono-reset" />
          </button>
        </div>
      </section>
    </header>
    <section>
      {#each news as item (item.id)}
        <NewsItem {item} />
      {/each}
    </section>
  </main>
{/if}
