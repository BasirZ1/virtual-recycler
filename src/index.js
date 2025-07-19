export class VirtualRecycler {
  constructor({
    container,
    data,
    itemHeight = "auto",
    itemMarginInPx = 0,
    visibleCount,
    render,
    containerClass = "recycler-container",
    itemClass = "recycler-item"
  }) {
    if (!container || !render) throw new Error("Missing required parameters");

    this.container = container;
    this.data = data;
    this.itemMarginInPx = itemMarginInPx;
    this.render = render;
    this.containerClass = containerClass;
    this.itemClass = itemClass;
    this.poolSize = visibleCount + 4;
    this.fixedRowHeight = itemHeight + itemMarginInPx;   // only used when not auto

    this.variableHeightMode = itemHeight === "auto";
    this.totalItems = data.length;
    this.rowHeights = new Array(this.totalItems).fill(
      this.variableHeightMode ? 0 : itemHeight + itemMarginInPx
    );
    this.offsets = [0];
    for (let i = 1; i <= this.totalItems; i++) {
      this.offsets[i] = this.offsets[i - 1] + this.rowHeights[i - 1];
    }

    this.currentStartIndex = 0;
    this.domPool = [];
    this.cellMap = new Array(this.poolSize).fill(-1);

    this.container.classList.add(this.containerClass);
    this._setupContainer();

    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const idx = +entry.target.dataset.realIndex;
        const newHeight = entry.contentRect.height + this.itemMarginInPx;
        this._setHeight(idx, newHeight);
        this._positionRow(entry.target, idx); // reposition self
      }
    });

    this._initDOMPool();
    this._attachScrollHandler();
  }

  _setupContainer() {
    this.container.style.position = "relative";
    this.container.style.overflowY = "auto";

    this.spacer = document.createElement("div");
    this.spacer.style.height = `${this.offsets[this.totalItems]}px`;
    this.container.appendChild(this.spacer);

    this.poolWrapper = document.createElement("div");
    this.poolWrapper.style.position = "absolute";
    this.poolWrapper.style.top = "0";
    this.poolWrapper.style.left = "0";
    this.poolWrapper.style.right = "0";
    this.container.appendChild(this.poolWrapper);
  }

  _initDOMPool() {
    for (let i = 0; i < this.poolSize; i++) {
      const el = document.createElement("div");
      el.className = this.itemClass;
      el.style.position = "absolute";
      this.poolWrapper.appendChild(el);
      this.domPool.push(el);
    }
    this._renderVisibleItems(0);
  }

  _attachScrollHandler() {
    this._boundScrollHandler = () => {
      const scrollTop = this.container.scrollTop;
      const startIndex = this._binarySearchOffsets(scrollTop);
      if (startIndex !== this.currentStartIndex) {
        this._renderVisibleItems(startIndex);
        this.currentStartIndex = startIndex;
      }
    };

    this.container.addEventListener("scroll", this._boundScrollHandler);
  }

  _binarySearchOffsets(y) {
    let lo = 0, hi = this.totalItems;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.offsets[mid] <= y) lo = mid + 1;
      else hi = mid;
    }
    return Math.max(0, lo - 1);
  }

  _setHeight(index, newHeight) {
    const oldHeight = this.rowHeights[index];
    if (oldHeight === newHeight) return;

    const delta = newHeight - oldHeight;
    this.rowHeights[index] = newHeight;

    for (let i = index + 1; i <= this.totalItems; i++) {
      this.offsets[i] += delta;
    }

    this.spacer.style.height = `${this.offsets[this.totalItems]}px`;

    // Reposition only affected rows
    for (let i = 0; i < this.poolSize; i++) {
      const realIndex = this.cellMap[i];
      if (realIndex > index) {
        this._positionRow(this.domPool[i], realIndex);
      }
    }
  }

  _positionRow(el, idx) {
    el.style.transform = `translateY(${this.offsets[idx]}px)`;
  }

  _renderVisibleItems(startIndex) {
    for (let i = 0; i < this.poolSize; i++) {
      const realIndex = startIndex + i;
      const el = this.domPool[i];

      if (realIndex >= this.totalItems) {
        this.resizeObserver.unobserve(el);
        el.style.display = "none";
        el.dataset.realIndex = "";
        continue;
      }

      this.render(el, this.data[realIndex], realIndex);
      el.style.display = "block";
      this.cellMap[i] = realIndex;
      el.dataset.realIndex = realIndex;

      const measuredHeight = el.offsetHeight + this.itemMarginInPx;
      this._setHeight(realIndex, measuredHeight);
      this._positionRow(el, realIndex);
      this.resizeObserver.observe(el);
    }
  }

  updateData(newData) {
    this.data = newData;
    this.totalItems = newData.length;
    this.rowHeights = new Array(this.totalItems).fill(
      this.variableHeightMode ? 0 : this.fixedRowHeight
    );
    this.offsets = [0];
    for (let i = 1; i <= this.totalItems; i++) {
      this.offsets[i] = this.offsets[i - 1] + this.rowHeights[i - 1];
    }
    this.spacer.style.height = `${this.offsets[this.totalItems]}px`;
    this.cellMap.fill(-1);
    this._renderVisibleItems(0);
  }

  removeItem(indexToRemove) {
    if (indexToRemove < 0 || indexToRemove >= this.totalItems) return;

    // Remove item from data
    this.data.splice(indexToRemove, 1);
    this.totalItems = this.data.length;

    // Remove height for that row
    this.rowHeights.splice(indexToRemove, 1);

    // Recalculate offsets
    this.offsets = [0];
    for (let i = 0; i < this.totalItems; i++) {
      this.offsets[i + 1] = this.offsets[i] + this.rowHeights[i];
    }

    // Update spacer height
    this.spacer.style.height = `${this.offsets[this.totalItems]}px`;

    // Reset cellMap to avoid reusing stale DOM
    this.cellMap.fill(-1);

    // Find new start index based on current scroll
    const scrollTop = this.container.scrollTop;
    const startIndex = this._binarySearchOffsets(scrollTop);

    // Re-render from current scroll position
    this._renderVisibleItems(startIndex);
    this.currentStartIndex = startIndex;
  }

  destroy() {
    if (this._boundScrollHandler) {
      this.container.removeEventListener("scroll", this._boundScrollHandler);
    }

    this.domPool.forEach(el => {
      this.resizeObserver.unobserve(el);
      el.remove();
    });

    if (this.poolWrapper) this.poolWrapper.remove();
    if (this.spacer) this.spacer.remove();

    this.domPool = [];
    this.poolWrapper = null;
    this.spacer = null;
    this.container = null;
    this.data = [];
    this.render = null;
    this.resizeObserver.disconnect();
  }
}
