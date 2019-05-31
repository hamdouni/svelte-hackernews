# Hacker News Reader Svelte App

This is a mobile PWA project to demonstrate a real use case of Svelte.

*Requirements : [Node.js](https://nodejs.org).*

Install dependencies :

```bash
npm install
```

Local test :

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000).

# Build

```
npm run build
```

Folder 'public' contains all needed files.

# Deploy to [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public
```

# Add to your mobile page

On your mobile, [consult the page](https://barim.surge.sh) on surge with https.

On Firefox : click on the house icon to add the app to the home screen.

On Chrome : in the menu, select "Add to homescreen".

# Thanks

* [Svelte](https://svelte.dev)
* [Icono](https://saeedalipoor.github.io/icono/)
