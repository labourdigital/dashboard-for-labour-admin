Polymer({
  is: 'd4l-twibbyn-details',
  behaviors: [
    Polymer.D4LLogging
  ],
  properties: {
    logLevel: {
      type: Number,
      value: 4
    },
    auth: {
      type: Object
    },
    db: {
      type: Object,
      notify: true
    },
    twibbyn: {
      type: Object,
      observer: '__twibbynChanged',
      notify: true
    },
    __openEditDialog: {
      type: Boolean,
      value: false
    },
    __edit: {
      type: Object,
      value: function() {
        return {
          title: '',
          description: ''
        }
      }
    },
    metadata: {
      type: Object,
      notify: true
    },
    __uploadResponse: {
      type: Object,
      value: function() {
        return {};
      }
    }
  },

  observers: [
    '__onUploadResponse(__uploadResponse.response)'
  ],

  __twibbynChanged: function(twibbyn) {
    if (!twibbyn || !twibbyn.id) {
      return;
    }

    let meta = this.get(['db.campaign.metadata', twibbyn.id]);
    this.__debug('__twibbynChanged', twibbyn.id, meta);
    if (!meta) {
      const metaDefault = {
        __populate__: true,
        images: []
      };
      this.set(['db.campaign.metadata', twibbyn.id], metaDefault);
    }
    this.metadata = this.get(['db.campaign.metadata', twibbyn.id]);
    this.linkPaths('metadata', `db.campaign.metadata.${twibbyn.id}`);
  },

  __editTwibbyn: function() {
    this.__edit.title = this.get('twibbyn.name');
    this.__edit.description = this.get('twibbyn.description');
    this.__openEditDialog = true;
  },

  __saveTwibbyn: function(ev) {
    this.__debug(ev.detail.item);
    this.set('twibbyn.name', ev.detail.item.title);
    this.set('twibbyn.description', ev.detail.item.description);
  },

  __removeImage: function(ev) {
    this.__debug(ev.model.get('index'));
    this.__debug(this.get(['metadata.images',ev.model.get('index')]));
    this.splice('metadata.images', ev.model.get('index'), 1);
  },

  __onUploadResponse: function(response) {
    if (!response) {
      // this.__warn('Invalid response', response);
      return;
    }
    this.__debug(response);
    let images = this.get('metadata.images');
    if (images.indexOf(response) === -1) {
      this.push('metadata.images', response);
    }
  }

});
