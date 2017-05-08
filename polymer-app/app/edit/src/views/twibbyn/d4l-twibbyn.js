Polymer({
  is: 'd4l-twibbyn',
  behaviors: [
    Polymer.D4LLogging,
    Polymer.D4LViewList
  ],
  properties: {
    logLevel: {
      type: Number,
      value: 3
    },
    auth: {
      type: Object
    },
    __pageTitle: {
      type: String,
      value: 'Twibbyn for Labour'
    },
    __twibbynIndices: {
      type: Array,
      value: function() { return []; }
    }
  },
  observers: [
    '__twibbynSaved(db.campaign.data.*)'
  ],

  attached: function() {
  },

  __addTwibbyn: function() {
    this.push('db.campaign.data', {
      name: 'Twibbyn Campaign',
      type: 'twibbyn',
      status: 'pending',
      ownerId: this.get('auth.user.id')
    });
    this.__twibbynIndices.push(this.get('db.contract.data.length')-1);
  },

  __twibbynSaved: function(cr) {
    this.__debug('__twibbynSaved', this.__twibbynIndices, cr);
    if (this.__twibbynIndices.length === 0 || !cr.path) {
      return;
    }

    let rex = /^db\.campaign\.data\.#(\d+).id$/;
    let matches = rex.exec(cr.path);
    if (!matches) {
      return;
    }

    let index = this.__twibbynIndices.findIndex(i => i == matches[1]);
    if (index === -1) {
      this.__warn(`Invalid twibbyn index: ${matches[1]}`, this.__twibbynIndices);
      return;
    }

    this.__contractIndices.splice(index, 1);
  },

});
