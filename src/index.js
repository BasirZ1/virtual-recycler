export class VirtualRecycler {
  constructor({container, data, itemHeight, itemMarginInPx, visibleCount, render, containerClass = "recycler-container",
  itemClass = "recycler-item"}) {
    this.containerClass = containerClass;
    this.itemClass = itemClass;

    this.container = container;
    this.data = data;
    this.visibleCount = visibleCount;
    this.render = render;
    if (itemHeight === "auto") {
      const sample = document.createElement("div");
      sample.style.visibility = "hidden";
      this.render(sample, this.data[0], 0);
      document.body.appendChild(sample);
      this.itemHeight = sample.offsetHeight + itemMarginInPx;
      sample.remove();
    } else {
      this.itemHeight = itemHeight + itemMarginInPx;
    }
    this.totalItems = data.length;
    this.currentStartIndex = 0;
    this.domPool = [];

    container.classList.add(this.containerClass);

    this._setupContainer();
    this._initDOMPool();
    this._attachScrollHandler();
  }

  _setupContainer() {
    this.container.style.position = "relative";
    this.container.style.overflowY = "auto";

    this.spacer = document.createElement("div");
    this.spacer.style.height = `${this.totalItems * this.itemHeight}px`;
    this.container.appendChild(this.spacer);

    this.poolWrapper = document.createElement("div");
    this.poolWrapper.style.position = "absolute";
    this.poolWrapper.style.top = "0";
    this.poolWrapper.style.left = "0";
    this.poolWrapper.style.right = "0";
    this.container.appendChild(this.poolWrapper);
  }

  _initDOMPool() {
    for (let i = 0; i < this.visibleCount; i++) {
      const el = document.createElement("div");
      el.className = this.itemClass;
      el.style.position = "absolute";
      el.style.height = `${this.itemHeight}px`;
      this.poolWrapper.appendChild(el);
      this.domPool.push(el);
    }
    this._renderVisibleItems(0);
  }

  _attachScrollHandler() {
    this._boundScrollHandler = () => {
      const scrollTop = this.container.scrollTop;
      const startIndex = Math.floor(scrollTop / this.itemHeight);

      if (startIndex !== this.currentStartIndex) {
        this._renderVisibleItems(startIndex);
        this.currentStartIndex = startIndex;
      }
    };

    this.container.addEventListener("scroll", this._boundScrollHandler);
  }


  _renderVisibleItems(startIndex) {
    for (let i = 0; i < this.visibleCount; i++) {
      const realIndex = startIndex + i;
      const el = this.domPool[i];

      if (realIndex >= this.totalItems) {
        el.style.display = "none";
        continue;
      }

      el.style.display = "block";
      el.style.transform = `translateY(${realIndex * this.itemHeight}px)`;
      this.render(el, this.data[realIndex], realIndex);
    }
  }

  updateData(newData) {
    this.data = newData;
    this.totalItems = newData.length;
    this.spacer.style.height = `${this.totalItems * this.itemHeight}px`;
    this._renderVisibleItems(this.currentStartIndex);
  }

  destroy() {
    // Remove scroll listener
    if (this._boundScrollHandler) {
      this.container.removeEventListener("scroll", this._boundScrollHandler);
    }

    // Clear DOM elements from container
    if (this.poolWrapper) {
      this.poolWrapper.remove();
    }

    if (this.spacer) {
      this.spacer.remove();
    }

    // Null all internal references to help GC
    this.domPool.forEach(el => {
      el.remove(); // remove from DOM
    });
    this.domPool = [];

    this.poolWrapper = null;
    this.spacer = null;
    this.container = null;
    this.data = [];
    this.render = null;
  }
}
