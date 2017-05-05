Polymer({
  is: 'd4l-dashboard',
  behaviors: [
    Polymer.D4LLogging
  ],
  properties: {
    logLevel: {
      type: Number,
      value: 3
    },
    auth: {
      type: Object
    },

    __post: {
      type: Object,
      value: function () { return {}; }
    },
  },
  attached: function() {

  }
});
