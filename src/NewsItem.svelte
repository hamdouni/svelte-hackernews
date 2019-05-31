<script>
  export let item;

  item.urlcomment = `https://news.ycombinator.com/item?id=${item.id}`;
  
  item.url = item.url.startsWith("http")
    ? item.url
    : item.urlcomment;
  
</script>

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
    flex-grow: 8;
  }
  a.comment {
    flex-grow: 1;
    align-items: center;
    display: flex;
    min-width: 5rem;
    max-width: 5rem;
  }
</style>

<div class="flex-container">
  <a class="main" href={item.url} target="_blank">
    <div class="title">{item.title}</div>
    <div class="metadata">
       {item.user} - {item.time_ago} - {item.points} points
    </div>
  </a>
  <a class="comment" href={item.urlcomment} target="_blank">
    <i class="icono-commentEmpty" /> {item.comments_count}
  </a>
</div>
