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

  __onUploadResponse: function(response) {
    this.__debug(response);
    if (!response) {
      this.__warn('Invalid response', response);
      return;
    }

    let images = this.get('metadata.images');
    if (images.indexOf(response) === -1) {
      this.push('metadata.images', response);
    }
  }

});
