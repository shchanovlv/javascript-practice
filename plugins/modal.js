function _createModal(options) {
  const modal = document.createElement('div')
  modal.classList.add('vmodal')
  const _html = `<div class="modal-overlay" data-close="true">
    <div class="modal-window ${options.animate}">
      <div class="modal-header">
        <span class="modal-title"></span>
        <span class="modal-close" data-close="true">&times;</span>
      </div>
      <div class="modal-body"></div>
      <div class="modal-footer"></div>
    </div>
  </div>`
  modal.insertAdjacentHTML('afterbegin', _html)
  document.body.appendChild(modal)
  return modal
}
$.modal = function (options) {
  const ANIMATION_SPEED = 200
  const handle = {
    main: _createModal(options)
  }
  handle.title = handle.main.querySelector('.modal-title')
  handle.body = handle.main.querySelector('.modal-body')
  handle.close = handle.main.querySelector('.modal-close')
  handle.window = handle.main.querySelector('.modal-window')
  handle.header = handle.main.querySelector('.modal-header')
  handle.footer = handle.main.querySelector('.modal-footer')
  handle.ok = handle.main.querySelector('.modal-ok')
  handle.cancel = handle.main.querySelector('.modal-cancel')
  handle.overlay = handle.main.querySelector('.modal-overlay')
  handle.activate = handle.main.querySelector('.modal-overlay')

  let closing = false
  const ret = {}
  const result = {
    get title() {
      return handle.title.innerHTML
    },
    set title(value) {
      handle.title.innerHTML = value
    },
    get closeable() {
      return handle.close.style.visibility !== 'hidden'
    },
    set closeable(value) {
      handle.close.style.visibility = (value ? 'visible' : 'hidden')
    },
    get body() {
      return handle.body.innerHTML
    },
    set body(value) {
      handle.body.innerHTML = value
    },
    get width() {
      return handle.window.style.width
    },
    set width(value) {
      handle.window.style.width = value
    },
    setFooterButtons(value) {
      handle.footer.querySelectorAll('*').forEach(function (el) {
        el.remove()
      })
      const templ = footerButton => `
        <button class="btn btn-${footerButton.type} footer-button" data-close="true" data-ret="${footerButton.ret}">${footerButton.text}</button>`
      handle.footer.innerHTML = value.map(templ).join('')
      handle.footer.querySelectorAll('.footer-button').forEach(function (el, i) {
        const b = {
          func(event) {
            return value[i].handler(event, ret)
          }
        }
        el.onclick = b.func
      })
    },
    get onOpen() {
      return onOpen
    },
    set onOpen(value) {
      onOpen = value
    },
    open() {
      let ret = true
      if (this.onOpen !== undefined)
        ret = onOpen()
      if (!closing && ret && !closing)
        handle.main.classList.add('open')
      else
        handle.main.remove()
    },
    close(event) {
      closing = true
      handle.main.classList.remove('open')
      handle.main.classList.add('hide')
      setTimeout(() => {
        handle.main.classList.remove('hide')
        closing = false
        handle.main.remove()
      }, ANIMATION_SPEED)
    }
  }
  handle.main.addEventListener('click', event => {
    if (event.target.dataset.close) {
      result.close()
    }
  })
  // инициализация options
  result.title = options.title;
  result.closeable = options.closeable;
  result.body = options.body;
  result.width = options.width;
  result.setFooterButtons(options.footerButtons);
  result.onOpen = options.onOpen;
  return new Promise((resolve, reject) => {
    result.open()
    ret.rr = 0
    ret.resolve = resolve
    ret.reject = reject
    return ret
  })
}