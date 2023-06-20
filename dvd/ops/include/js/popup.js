(() => {
  class Popup {
    constructor(opts) {
      this.binding();
      this.init(opts);
    }

    binding() {
      this.open = this.open.bind(this);
      this.close = this.close.bind(this);
    }

    open() {
      this.container.on();

      this.callback && this.callback.open && this.callback.open(this);
    }

    close() {
      this.container.off();

      this.callback && this.callback.close && this.callback.close(this);
    }

    reset() {

    }

    init({container, name, popupButton, closeButton, callback = null}) {
      this.container = container;
      this.name = name;

      popupButton.forEach((button) => {
        button.hover();
        button.event('click touchstart', this.open);
      });
      closeButton.forEach((button) => {
        button.hover();
        button.event('click touchstart', this.close);
      });

      if (callback) this.callback = callback;

      $CM.inPage[(name || 'popup')] = {
        _this: this,
        open: this.open,
        close: this.close,
        reset: this.reset,
      }
    }
  }
  
  window.$ic.Popup = Popup;
})();