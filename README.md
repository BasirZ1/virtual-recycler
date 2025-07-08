````markdown
# Index

**Index** is a zero-dependency, ultra-fast virtual list scroller inspired by Android's RecyclerView — built with performance and simplicity in mind. Created by [BasirSoft](https://basirsoft.com).

![Demo](./demo.gif)

---

## 🚀 Features

- 🔁 True DOM recycling — only a fixed number of elements in the DOM
- ⚡ Handles 10,000+ items with ease
- 🧱 Fully customizable renderer per item
- 💡 Framework-agnostic, written in plain JavaScript
- 📦 Tiny footprint, no dependencies

---

## 💡 Use Cases

- Inventory systems (e.g. curtain rolls, stock lists)
- Admin dashboards
- Log viewers
- File explorers
- Any large dataset in a scrollable list

---

## 📦 Installation

```bash
npm install virtual-recycler
# or
yarn add virtual-recycler
````

---

## 🧩 Usage

```html
<div id="recycler" style="height: 600px;"></div>
```

```js
import { Index } from 'virtual-recycler';

const data = Array.from({ length: 10000 }, (_, i) => ({
  code: `ROLL${i}`,
  name: `Curtain Roll ${i}`
}));

new Index({
  container: document.getElementById('recycler'),
  data,
  itemHeight: 100,
  visibleCount: 12,
  render: (el, item, index) => {
    el.innerHTML = `<strong>${item.code}</strong> - ${item.name}`;
  }
});
```

---

## ⚙️ API

| Option         | Type            | Required | Description                                 |
| -------------- | --------------- | -------- | ------------------------------------------- |
| `container`    | `HTMLElement`   | ✅        | Scrollable container element                |
| `data`         | `Array`         | ✅        | Your dataset                                |
| `itemHeight`   | `number`        | ✅        | Fixed height of each item in px             |
| `visibleCount` | `number`        | ✅        | Max DOM elements to keep in pool            |
| `render`       | `(el, item, i)` | ✅        | Function to populate or update item content |

---

## 📸 Demo

> A live demo is available at: [virtual-recycler.vercel.app](https://virtual-recycler.vercel.app) (Coming soon)

---

## 🛠️ Advanced

* ✅ `updateData(newData)` — replace data and re-render
* ⚙️ Extend to support:

  * Infinite scroll
  * Image lazy loading
  * Grid layout

---

## 📄 License

MIT — Free for personal and commercial use.
Made with focus and simplicity by [Abdul Basir Zurmati](https://github.com/BasirZ1) @ BasirSoft.

---

## 🧠 Contribute

PRs, ideas and forks welcome.
If you build something cool with it — show us!

