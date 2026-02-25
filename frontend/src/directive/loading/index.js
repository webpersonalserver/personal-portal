const LOADING_CLASS = 'v-loading';
const MASK_CLASS = 'v-loading-mask';
const SPINNER_CLASS = 'v-loading-spinner';

// 创建 loading 遮罩层
function createLoadingElement() {
  const mask = document.createElement('div');
  mask.className = MASK_CLASS;

  const spinner = document.createElement('div');
  spinner.className = SPINNER_CLASS;
  spinner.innerHTML = `
    <svg viewBox="0 0 50 50" class="v-loading-svg">
      <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="4"></circle>
    </svg>
  `;

  mask.appendChild(spinner);
  return mask;
}

// 显示 loading
function showLoading(el) {
  if (el.querySelector(`.${MASK_CLASS}`)) {
    return;
  }

  const position = window.getComputedStyle(el).position;
  if (!position || position === 'static') {
    el.style.position = 'relative';
  }

  const mask = createLoadingElement();
  el.classList.add(LOADING_CLASS);
  el.appendChild(mask);
}

// 隐藏 loading
function hideLoading(el) {
  const mask = el.querySelector(`.${MASK_CLASS}`);
  if (mask) {
    el.classList.remove(LOADING_CLASS);
    el.removeChild(mask);
  }
}

export default {
  mounted(el, binding) {
    if (binding.value) {
      showLoading(el);
    }
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      if (binding.value) {
        showLoading(el);
      } else {
        hideLoading(el);
      }
    }
  },
  unmounted(el) {
    hideLoading(el);
  }
};
