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
          thunderclapTime: new Date(),
          supporters: [],
          userCount: 0
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

    let date = Sugar.Date.create(this.get('metadata.thunderclapTime'));
    this.__edit.date = Sugar.Date.format(date, '{yyyy}-{MM}-{dd}');
    this.__edit.time = Sugar.Date.format(date, '{HH}:{mm}');
    this.__debug(this.__edit);
    this.__openEditDialog = true;
  },

  __saveCampaign: function(ev) {
    this.__debug(ev.detail.item);
    let item = ev.detail.item;
    this.set('campaign.name', item.title);
    this.set('campaign.description', item.description);
    this.set('metadata.thunderclapTime',Sugar.Date.create(`${item.date} ${item.time}`).toISOString());
  },

  __removeImage: function() {
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
