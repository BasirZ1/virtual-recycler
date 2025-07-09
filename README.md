````markdown
# VirtualRecycler

**VirtualRecycler** is a zero-dependency, ultra-fast virtual list scroller inspired by Android's RecyclerView — built with performance and simplicity in mind.
Created by [BasirSoft](https://basirsoft.com).

---

## 🚀 Features

- 🔁 True DOM recycling — only a fixed number of elements in the DOM
- ⚡ Handles 10,000+ items with ease
- 🧱 Fully customizable renderer per item
- 💡 Framework-agnostic, written in plain JavaScript
- 📦 Tiny footprint, no dependencies

---

## 💡 Use Cases

- Inventory systems (e.g. user lists, stock lists)
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
import { VirtualRecycler } from 'virtual-recycler';

const data = Array.from({ length: 10000 }, (_, i) => ({
  sku: `SKU-${1000 + i}`,
  name: `Product #${i + 1}`,
  price: `$${(Math.random() * 100).toFixed(2)}`
}));

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('recycler');
  container.classList.add('recycler-container');

  new VirtualRecycler({
    container,
    data,
    itemHeight: 100,
    itemMarginInPx: 5,
    visibleCount: 12,
    render: (el, item, index) => {
      el.innerHTML = `
        <div>
            <strong class="product__name">${item.name}</strong>
            <span class="product__sku">(${item.sku})</span>
        </div>
        <small class="product__price">Price: ${item.price}</small>
      `;
    }
  });
});
```

---

## ⚙️ API

| Option           | Type              | Required | Description                                                                             |
|------------------|-------------------|----------|-----------------------------------------------------------------------------------------|
| `container`      | `HTMLElement`     | ✅        | Scrollable container element                                                            |
| `data`           | `Array`           | ✅        | Your dataset                                                                            |
| `itemHeight`     | `number` `String` | ✅        | Fixed height of each item in px or<br/> "auto" for automatic cal based on one mock item |
| `itemMarginInPx` | `number`          | ✅        | margin-bottom added for each item                                                       |
| `visibleCount`   | `number`          | ✅        | Max DOM elements to keep in pool                                                        |
| `render`         | `(el, item, i)`   | ✅        | Function to populate or update item content                                             |
| `containerClass` | `String`          | ✅        | Custom class for styling recycler-container                                             |
| `itemClass`      | `String`          | ✅        | Custom class for styling recycler items                                                 |

---

## 📸 Demo

> A live demo is available at: [virtual-recycler.vercel.app](https://virtual-recycler.vercel.app)

---

## 🛠️ Advanced

* ✅ `updateData(newData)` — replace data and re-render
* ✅ `destroy()` — to destroy VirtualRecycler instance and avoid memory leak.
* ⚙️ Extend to support:

  * Grid layout

---

## 📄 License

MIT — Free for personal and commercial use.
Made with focus and simplicity by [Abdul Basir Zurmati](https://github.com/BasirZ1) @ BasirSoft.

---

## 🧠 Contribute

PRs, ideas and forks welcome.
If you build something cool with it — show us!

