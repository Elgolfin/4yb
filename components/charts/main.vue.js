/* global db_4yb */
const app = require('electron').remote.app;
const jetpack = require('fs-jetpack').cwd(app.getAppPath());
var Vue = require('vue');
var Chart = require('../../js/Chart.min.js');
var TransactionsManager = require('../../js/transactions-manager.js').TransactionsManager;

exports.main = Vue.extend({
    data: function () {
        return { 
            title: "Charts",
            data: null /*{
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: "My First dataset",
                        fillColor: "rgba(220,220,220,0.5)",
                        strokeColor: "rgba(220,220,220,0.8)",
                        highlightFill: "rgba(220,220,220,0.75)",
                        highlightStroke: "rgba(220,220,220,1)",
                        data: [65, 59, 80, 81, 56, 55, 40]
                    },
                    {
                        label: "My Second dataset",
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,0.8)",
                        highlightFill: "rgba(151,187,205,0.75)",
                        highlightStroke: "rgba(151,187,205,1)",
                        data: [28, 48, 40, 19, 86, 27, 90]
                    }
                ]
            }*/
        }
    },
    template: jetpack.read('./components/charts/main.vue.html'),
    ready: function(){
        // /*
        var tm = new TransactionsManager(db_4yb);
        tm.rootAccount = 'a';
        tm.inheritance = true;
        var vm = this;
        tm.getAll(function(transactions){
            vm.data = transactions.getChartsDataSet();
            var ctx1 = document.getElementById("myChart1").getContext("2d");
            var myBarChart1 = new Chart(ctx1).Bar(vm.data);
            var ctx2 = document.getElementById("myChart2").getContext("2d");
            var myBarChart2 = new Chart(ctx2).Line(vm.data);
        });
        // */
        
        /*
        var ctx1 = document.getElementById("myChart1").getContext("2d");
        var myBarChart1 = new Chart(ctx1).Bar(this.data);
        var ctx2 = document.getElementById("myChart2").getContext("2d");
        var myBarChart2 = new Chart(ctx2).Line(this.data);
        // */
    }
});