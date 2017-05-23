Polymer({
  is: 'd4l-thunderclap',
  behaviors: [
    Polymer.D4LLogging,
    Polymer.D4LViewList,
    Polymer.D4LCampaign
  ],
  properties: {
    logLevel: {
      type: Number,
      value: 3
    },
    auth: {
      type: Object
    },
    type: {
      type: String,
      value: 'thunderclap'
    },
    __pageTitle: {
      type: String,
      value: 'Thunderclap for Labour'
    }
  },

  attached: function() {
  },

  __addThunderclap: function() {
    this.push('db.campaign.data', {
      name: 'Thunderclap Campaign',
      type: 'thunderclap',
      status: 'unpublished',
      ownerId: this.get('auth.user.id')
    });

    this.__campaignIndices.push(this.get('db.campaign.data.length')-1);
  }
});
