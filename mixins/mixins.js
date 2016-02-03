// Mixins
exports.mixin = {
  methods: {
    changeView: function (view) {
        console.log("Change view from " + this.$root.currentView + " to " + view);
        this.$root.currentView = view;
    }
  }
}