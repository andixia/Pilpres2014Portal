﻿///<reference path="Scripts/typings/jquery/jquery.d.ts"/>
///<reference path="Scripts/typings/knockout/knockout.d.ts"/>
var VoteEntry = (function () {
    function VoteEntry() {
        this.totalVotes1 = ko.observable("");
        this.percentageVotes1 = ko.observable("");
        this.totalVotes2 = ko.observable("");
        this.percentageVotes2 = ko.observable("");
        this.total = ko.observable("");
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

            // Sets the current feed as the first one
            var historicalFeedsLength = _this.historicalFeeds().length;
            var currentFeedItem = _this.historicalFeeds()[0];
            _this.selectedDataFeed(currentFeedItem);

            _this.refresh(_this.selectedDataFeed().datetime);

            _this.selectedDataFeed.subscribe(function (value) {
                _this.refresh(value.datetime);
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
                    voteEntry.totalVotes1(entry.PrabowoHattaVotes);
                    voteEntry.percentageVotes1(parseFloat(entry.PrabowoHattaPercentage).toFixed(2));
                    voteEntry.totalVotes2(entry.PrabowoHattaVotes);
                    voteEntry.percentageVotes2(parseFloat(entry.JokowiKallaPercentage).toFixed(2));
                    voteEntry.total(entry.Total);
                    voteEntry.label(entry.Province);

                    self.voteEntries.push(voteEntry);
                });
            };

            this.query("KPU-Feeds-" + this.selectedDataFeed().datetime + "-province.json", null, provinceCallback);
        }
    };

    Pilpres2014.prototype.refresh = function (datetime) {
        var _this = this;
        var self = this;
        self.voteEntries.removeAll();

        var totalCallback = function (data, status) {
            var _this = this;
            console.log("response:" + status);
            if (status !== "success") {
                return;
            }

            var dataJson = JSON.parse(data);
            dataJson.forEach(function (entry) {
                var context = _this;
                var voteEntry = new VoteEntry();
                voteEntry.totalVotes1(entry.PrabowoHattaVotes);
                voteEntry.percentageVotes1(parseFloat(entry.PrabowoHattaPercentage).toFixed(2) + "%");
                voteEntry.totalVotes2(entry.JokowiKallaVotes);
                voteEntry.percentageVotes2(parseFloat(entry.JokowiKallaPercentage).toFixed(2) + "%");
                voteEntry.total(entry.Total);
                voteEntry.label(datetime);

                self.voteEntries.push(voteEntry);
            });
        };

        this.historicalFeeds().forEach(function (value) {
            _this.query("KPU-Feeds-" + value.datetime + "-total.json", value.datetime, totalCallback);
        });
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
