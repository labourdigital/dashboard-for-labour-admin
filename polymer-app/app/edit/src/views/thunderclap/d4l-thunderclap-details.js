Polymer({
  is: 'd4l-thunderclap-details',
  behaviors: [
    Polymer.D4LLogging,
    Polymer.D4LCampaignDetails
  ],
  properties: {
    logLevel: {
      type: Number,
      value: 4
    },
    type: {
      type: String,
      value: 'thunderclap'
    },
    metaDefault: {
      type: Object,
      value: function() {
        return {
          __populate__: true,
          featured: '',
          date: '',
          supporter: []
        };
      }
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
    },
    __featuredImage: {
      type: String,
      computed: '__computeFeaturedImage(metadata.*)'
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
    this.set('metadata.featured', '');
  },

  __onUploadResponse: function(response) {
    if (!response) {
      // this.__warn('Invalid response', response);
      return;
    }
    this.__debug(response);
    this.set('metadata.featured', response);
  },

  __computeFeaturedImage: function() {
    return this.get('metadata.featured');
  }
});
