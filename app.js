﻿///<reference path="Scripts/typings/jquery/jquery.d.ts"/>
///<reference path="Scripts/typings/knockout/knockout.d.ts"/>
var VoteEntry = (function () {
    function VoteEntry() {
        this.counter1 = ko.observable(0);
        this.counter1Percentage = ko.observable("");
        this.counter2 = ko.observable(0);
        this.counter2Percentage = ko.observable("");
        this.total = ko.observable(0);
        this.label = ko.observable("");
    }
    return VoteEntry;
})();

var Pilpres2014 = (function () {
    function Pilpres2014() {
        var _this = this;
        var self = this;
        this.url = ko.observable("https://github.com/ht4n/Pilpres2014");
        this.provinces = ko.observableArray([]);
        this.totalVotes1 = ko.observable(0);
        this.totalVotes2 = ko.observable(0);
        this.percentageVotes1 = ko.observable("");
        this.percentageVotes2 = ko.observable("");
        this.totalVotes = ko.observable(0);
        this.voteEntries = ko.observableArray([]);
        this.showProvinceDetails = ko.observable(false);

        this.baseFeedUrl = "https://github.com/ht4n/Pilpres2014/blob/master/KPU-Feeds-";
        this.historicalFeeds = ko.observableArray([]);
        this.selectedDataFeed = ko.observable(null);

        this.query("feedsources.json", null, function (data, status) {
            console.log("response:" + status);
            if (status !== "success") {
                return;
            }

            var dataJson = JSON.parse(data);
            dataJson.forEach(function (entry) {
                self.historicalFeeds.push(entry);
            });

            // Sets the current feed (latest) one
            var historicalFeedsLength = _this.historicalFeeds().length;
            var currentFeedItem = _this.historicalFeeds()[historicalFeedsLength - 1];
            _this.selectedDataFeed(currentFeedItem);

            _this.refresh(_this.selectedDataFeed().datetime);

            _this.selectedDataFeed.subscribe(function (value) {
                _this.refresh(value);
            });
        });

        this.toggleProvinceText = ko.observable("Show votes by province");
    }
    Pilpres2014.prototype.updateVoteByDate = function (data, event) {
        var vm = ko.contextFor(event.currentTarget);
        vm.$root.refresh(data.datetime);
    };

    Pilpres2014.prototype.toggleProvinceDetails = function () {
        if (this.showProvinceDetails()) {
            this.showProvinceDetails(false);
            this.toggleProvinceText("Show votes by province");
        } else {
            this.showProvinceDetails(true);
            this.toggleProvinceText("Hide votes by province");

            var self = this;
            var provinceCallback = function (data, status) {
                console.log("response:" + status);
                if (status !== "success") {
                    return;
                }

                var dataJson = JSON.parse(data);
                self.voteEntries.removeAll();
                dataJson.forEach(function (entry) {
                    var voteEntry = new VoteEntry();
                    voteEntry.counter1(entry.PrabowoHattaVotes);
                    voteEntry.counter1Percentage(parseFloat(entry.PrabowoHattaPercentage).toFixed(2));
                    voteEntry.counter2(entry.PrabowoHattaVotes);
                    voteEntry.counter2Percentage(parseFloat(entry.JokowiKallaPercentage).toFixed(2));
                    voteEntry.total(entry.Total);
                    voteEntry.label(entry.Province);

                    self.voteEntries.push(voteEntry);
                });
            };

            this.query("KPU-Feeds-" + this.selectedDataFeed().datetime + "-province.json", null, provinceCallback);
        }
    };

    Pilpres2014.prototype.refresh = function (datetime) {
        var self = this;

        var totalCallback = function (data, status) {
            console.log("response:" + status);
            if (status !== "success") {
                return;
            }

            var dataJson = JSON.parse(data);
            dataJson.forEach(function (entry) {
                self.totalVotes(entry.Total);
                self.totalVotes1(entry.PrabowoHattaVotes);
                self.totalVotes2(entry.JokowiKallaVotes);
                self.percentageVotes1(parseFloat(entry.PrabowoHattaPercentage).toFixed(2) + "%");
                self.percentageVotes2(parseFloat(entry.JokowiKallaPercentage).toFixed(2) + "%");
            });
        };

        this.query("KPU-Feeds-" + datetime + "-total.json", null, totalCallback);
    };

    Pilpres2014.prototype.query = function (url, context, callback, statusCallback) {
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'text',
            contentType: 'application/json',
            context: context,
            statusCode: statusCallback
        }).always(function (data, status, jqXHR) {
            if (callback) {
                callback.call(this, data, status, jqXHR);
            }
        });
    };
    return Pilpres2014;
})();

window.onload = function () {
    var pilpres2014ViewModel = new Pilpres2014();
    ko.applyBindings(pilpres2014ViewModel);
};
//# sourceMappingURL=app.js.map
