Polymer({
  is: 'd4l-app-db',
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
    db: {
      type: Object,
      value: function() {
        return {
          post: {
            status: 'uninitialised',
            data: [],
            metadata: {}
          },
          user: {
            status: 'uninitialised',
            data: [],
            metadata: {}
          },
          notification: {
            status: 'uninitialised',
            data: [],
            metadata: {}
          },
          task: {
            status: 'uninitialised',
            data: [],
            metadata: {}
          }
        }
      },
      notify: true
    }
  },
  observers: [
    '__auth(auth.user)',
  ],

  attached: function() {
  },

  __auth: function() {
    if (!this.auth.user){
      return;
    }
    this.__debug('app-db:auth');
  },
});
