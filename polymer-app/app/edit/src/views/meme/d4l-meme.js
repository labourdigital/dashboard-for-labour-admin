Polymer({
  is: 'd4l-meme',
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
      value: 'meme'
    },
    __pageTitle: {
      type: String,
      value: 'Meme for Labour'
    }
  },

  attached: function() {
  },

  __addMeme: function() {
    this.push('db.campaign.data', {
      name: 'Meme Campaign',
      type: 'meme',
      status: 'unpublished',
      ownerId: this.get('auth.user.id')
    });

    this.__campaignIndices.push(this.get('db.campaign.data.length')-1);
  }
});
