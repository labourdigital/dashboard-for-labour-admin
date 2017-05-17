/**
 * @polymerBehavior Polymer.D4LCampaign
 */
Polymer.D4LCampaign = {
  properties: {
    type: {
      type: String,
      value: ""
    },
    metaDefault: {
      type: Object,
      value: function() {
        return {
          __populate__: true
        };
      }
    },
    __hasCampaigns: {
      type: Boolean,
      computed: '__computeHasCampaigns(db.campaign.data.*)'
    },
    __campaignsQuery: {
      type: Object,
      computed: '__computeCampaignsQuery(db.campaign.data.*)'
    },
    __campaigns: {
      type: Array,
      value: function() { return []; }
    },
    __campaignIndices: {
      type: Array,
      value: function() { return []; }
    }
  },

  observers: [
    '__campaignSaved(db.campaign.data.*)'
  ],

  __campaignSaved: function(cr) {
    if (this.__campaignIndices.length === 0 || !cr.path) {
      return;
    }
    this.__debug('__campaignSaved', this.__campaignIndices, cr);

    let rex = /^db\.campaign\.data\.#(\d+).id$/;
    let matches = rex.exec(cr.path);
    if (!matches) {
      return;
    }

    let index = this.__campaignIndices.findIndex(i => i == matches[1]);
    if (index === -1) {
      this.__warn(`Invalid campaign index: ${matches[1]}`, this.__campaignIndices);
      return;
    }
    this.__campaignIndices.splice(index, 1);
    this.fire('view-entity', `${this.type}/${cr.value}`);
  },

  __computeHasCampaigns: function() {
    let data = this.get('db.campaign.data');
    if (!data) {
      return false;
    }

    return data.findIndex(c => c.type === this.type) !== -1;
  },

  __computeCampaignsQuery: function() {
    let data = this.get('db.campaign.data');
    if (!data) {
      return null;
    }

    return {
      type: {
        $eq: this.type
      }
    };
  }
};


/**
 * @polymerBehavior Polymer.D4LCampaignDetails
 */
Polymer.D4LCampaignDetails = {
  properties: {
    type: {
      type: String,
      value: ""
    },
    auth: {
      type: Object
    },
    db: {
      type: Object,
      notify: true
    },
    campaign: {
      type: Object,
      notify: true
    },
    metadata: {
      type: Object,
      notify: true
    },
    metaDefault: {
      type: Object,
      value: function() {
        return {
          __populate__: true
        };
      }
    },

    __statusDescription: {
      type: String,
      computed: '__computeStatusDescription(campaign.status)'
    },
    __published: {
      type: Boolean,
      computed: '__computePublished(campaign.status)'
    },
  },

  observers: [
    '__campaignChanged(campaign, db.campaign.data.*)'
  ],

  __campaignChanged: function(campaign) {
    if (!campaign || !campaign.id) {
      return;
    }

    let meta = this.get(['db.campaign.metadata', campaign.id]);
    this.__debug('__campaignChanged', campaign.id, meta, this.metaDefault);
    if (!meta) {
      this.set(['db.campaign.metadata', campaign.id], this.metaDefault);
    }
    this.metadata = this.get(['db.campaign.metadata', campaign.id]);
    this.linkPaths('metadata', `db.campaign.metadata.${campaign.id}`);
  },

  __publish: function() {
    this.set('campaign.status', 'published');
  },

  __unpublish: function() {
    this.set('campaign.status', 'unpublished');
  },

  __computeStatusDescription(status) {
    if (status !== 'published') {
      return 'Not published yet.';
    }

    return 'Published';
  },

  __computePublished(status) {
    return status === 'published';
  }
};
