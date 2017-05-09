/**
 * @polymerBehavior Polymer.D4LFormDialog
 */
Polymer.D4LFormDialog = {
  properties: {
    name: {
      type: String,
      value: ""
    },
    item: {
      type: Object,
      value: function() { return {}; }
    },
    __item: {
      type: Object,
      value: function() { return {}; }
    },
    index: {
      type: Number,
      value: -1
    },
    open: {
      type: Boolean,
      notify: true,
      observer: '__openChanged'
    },
    __title: {
      type: String,
      computed: '__computeTitle(index, name)'
    },
    __action: {
      type: String,
      computed: '__computeAction(index)'
    },
    __updateMode: {
      type: Boolean,
      computed: '__computeUpdateMode(index)'
    }
  },
  __openChanged: function () {
    if (this.open === true) {
      this.__debug(this.item);
      this.__item = Object.assign({}, this.item);

      this.$.dialog.open();
    } else {
      this.$.dialog.close();
    }
  },

  __formChanged: function () {
    this.$.submit.disabled = !this.$.form.validate();
  },

  __formBeginSubmit: function () {
    if (!this.$.form.validate()) {
      return;
    }
    this.$.form.submit();
  },

  __computeTitle: function (index, name) {
    return index === -1 ? `Add ${name}` : `Update ${name}`
  },
  __computeAction: function (index) {
    return index === -1 ? `Add` : `Update`
  },
  __computeUpdateMode: function(index) {
    return index !== -1;
  },

  __formPresubmit: function (ev) {
    ev.preventDefault();
    this.__debug('__formPresubmit', this.index, this.__item);

    if (this.index === -1) {
      this.fire('add', this.__item, {
        bubbles: false
      });
    } else {
      this.fire('update', {
        item: Object.assign({}, this.__item),
        index: this.index
      },{
        bubbles: false
      });
    }

    this.$.form.reset();
    this.open = false;
  },

  __rmItem: function () {
    this.fire('remove', this.index);
    this.open = false;
  },

  __closeDialog: function() {
    this.open = false;
  },

  __dialogClosed: function (ev) {
    if (ev.target === this.$.dialog) {
      this.open = false;
    }
  }
};
