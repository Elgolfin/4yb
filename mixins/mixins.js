// Mixins
exports.mixin = {
  methods: {
    changeView: function (view, resetViewData) {
        console.log("Change view from " + this.$root.currentView + " to " + view);
        if (resetViewData) {
            this.$root.viewData = {};
        }
        this.$root.currentView = view;
    }
  }
}