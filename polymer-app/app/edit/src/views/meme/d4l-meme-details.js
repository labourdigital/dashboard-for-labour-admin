Polymer({
  is: 'd4l-meme-details',
  behaviors: [
    Polymer.D4LLogging,
    Polymer.D4LCampaignDetails
  ],
  properties: {
    logLevel: {
      type: Number,
      value: 4
    },
    db: {
      type: Object,
      notify: true
    },
    type: {
      type: String,
      value: 'meme'
    },
    metaDefault: {
      type: Object,
      value: function() {
        return {
          __populate__: true,
          images: [],
          shared: {}
        };
      }
    },
    __userImageTriageUrl: {
      type: String,
      value: 'http://cdn.forlabour.com/u/'
    },
    __statusDescription: {
      type: String,
      computed: '__computeStatusDescription(campaign.status)'
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

  __editCampaign: function() {
    this.__edit.title = this.get('campaign.name');
    this.__edit.description = this.get('campaign.description');
    this.__openEditDialog = true;
  },

  __saveCampaign: function(ev) {
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
  },

  __addUserImage: function(ev) {
    let post = ev.model.get('post');
    let image = `u/${post.image}`;

    let images = this.get('metadata.images');
    if (images.indexOf(image) === -1) {
      this.push('metadata.images', image);
    }
  },

  filterNotBlank: function(post) {
    return post.image ? true : false;
  }
});
