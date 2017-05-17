Polymer({
  is: 'd4l-twibbyn',
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
      value: 'twibbyn'
    },
    __pageTitle: {
      type: String,
      value: 'Twibbyn for Labour'
    }
  },

  __addTwibbyn: function() {
    this.push('db.campaign.data', {
      name: 'Twibbyn Campaign',
      type: 'twibbyn',
      status: 'unpublished',
      ownerId: this.get('auth.user.id')
    });
    this.__twibbynIndices.push(this.get('db.campaign.data.length')-1);
  }

});
