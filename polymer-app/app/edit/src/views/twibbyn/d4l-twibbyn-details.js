Polymer({
  is: 'd4l-twibbyn-details',
  behaviors: [
    Polymer.D4LLogging,
    Polymer.D4LCampaignDetails
  ],
  properties: {
    logLevel: {
      type: Number,
      value: 4
    },
    metaDefault: {
      type: Object,
      value: function() {
        return {
          __populate__: true,
          images: []
        };
      }
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

  __editTwibbyn: function() {
    this.__edit.title = this.get('campaign.name');
    this.__edit.description = this.get('campaign.description');
    this.__openEditDialog = true;
  },

  __saveTwibbyn: function(ev) {
    this.__debug(ev.detail.item);
    this.set('campaign.name', ev.detail.item.title);
    this.set('campaign.description', ev.detail.item.description);
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
