(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* Call to server to fetch data based on URL*/
var API = {
    _fetchDetails: function _fetchDetails(URL) {
        return fetch(URL, {
            method: 'get'
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            return data.Response == "False" ? undefined : data;
        }).catch(function (err) {
            console.log("err response: " + err);
        });
    }
};

exports.default = API;

},{}],2:[function(require,module,exports){
"use strict";

var _mainContent = require("./main-content.js");

var _mainContent2 = _interopRequireDefault(_mainContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mainContent = new _mainContent2.default({ containerId: "main" }); /* Entry file that index.html points to */

mainContent.render();

},{"./main-content.js":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* Constants used all over the app */
var URL = {
    BASE_URL: "http://www.omdbapi.com/?apikey=66a7c0ee&",
    TITLE_KEY: "t=",
    YEAR_KEY: "&y=",
    INITIAL_MOVIE_TITLE: "a",
    POSTER: "./assets/images/movie.jpeg"
};

exports.URL = URL;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by vidushi on 3/30/18.
 * Model class to store and operate on model
 */

var DataModel = function () {
    function DataModel(conf) {
        _classCallCheck(this, DataModel);

        this.model = {};
    }

    /* adds a new response data to the model */


    _createClass(DataModel, [{
        key: "addToModelCollection",
        value: function addToModelCollection(key, value) {
            this.model[key] = value;
        }

        /* Filters the data based on key from model & returns only the UI presentable fields */

    }, {
        key: "getFilteredData",
        value: function getFilteredData(dataKey) {
            var self = this;
            var keysModel = void 0;
            Object.keys(this.model).forEach(function (key) {
                if (key == dataKey) {
                    keysModel = self.model[key];
                    return;
                }
            });

            return {
                Actors: function () {
                    return DataModel.massageData(keysModel.Actors);
                }(),
                Released: function () {
                    return DataModel.massageData(keysModel.Released);
                }(),
                Awards: function () {
                    return DataModel.massageData(keysModel.Awards);
                }(),
                Country: function () {
                    return DataModel.massageData(keysModel.Country);
                }()
            };
        }

        /* Static method to massage the non-available data for the UI presentation */

    }, {
        key: "setMoreDetailsShown",


        /* Method to update the model with a flag indicating that more details are already rendered on the UI */
        value: function setMoreDetailsShown(dataKey) {
            this.model[dataKey] && (this.model[dataKey].showDetails = true);
        }

        /* Indicates if the more details are already shown on UI */

    }, {
        key: "isMoreDetailsShown",
        value: function isMoreDetailsShown(dataKey) {
            return this.model[dataKey] && this.model[dataKey].showDetails || undefined;
        }

        /* Method to check if the top most model item is same as current requested item */

    }, {
        key: "isPreviousSame",
        value: function isPreviousSame(dataKey, title) {
            if (this.model[dataKey] && this.model[dataKey].Title == title) {
                return true;
            }
        }
    }], [{
        key: "massageData",
        value: function massageData(dataValue) {
            return dataValue == "N/A" ? "Not Available" : dataValue;
        }
    }]);

    return DataModel;
}();

exports.default = DataModel;
;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _api = require('./api.js');

var _api2 = _interopRequireDefault(_api);

var _constants = require('./constants.js');

var _dataModel = require('./dataModel.js');

var _dataModel2 = _interopRequireDefault(_dataModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MainContent = function () {
    function MainContent(conf) {
        _classCallCheck(this, MainContent);

        this.containerId = conf.containerId;
        this.sequence = 0; // Used as a key to maintain the data in the model
    }

    /* method to render & initialize classes */


    _createClass(MainContent, [{
        key: 'render',
        value: function render() {
            this.dataModel = this._instantiateModel();
            this.domElements = this._getDomElements();
            this._registerEvents();
            this._getDetails(_constants.URL.BASE_URL + _constants.URL.TITLE_KEY + _constants.URL.INITIAL_MOVIE_TITLE + "&y=2014");
        }
    }, {
        key: '_getDetails',


        /* get movie details and attach to the dom, so as to be showcased on the UI */
        value: function _getDetails(url) {
            var _this = this;

            var self = this;

            var data = _api2.default._fetchDetails(url);
            var content = data.then(function (response) {

                if (!response || _this.dataModel.isPreviousSame(self.sequence, response.Title)) {
                    return Promise.reject();
                }

                ++self.sequence;
                var poster = response.Poster != "N/A" || !response.Poster ? response.Poster : _constants.URL.POSTER;
                var details = '<li data-key=' + self.sequence + ' style="border-top:2px green solid;float:left;clear:both;width: 800px;" class="collection-item">\n                        <span style="float:left;">\n                            <img id="posterImg" data-key=' + self.sequence + ' src=' + poster + ' alt=""> \n                        </span>\n                        <span id="highlights" style="margin-left:20px; float:left">\n                            <div><label>Title: </label>' + response.Title + '</div>\n                            <div><label>Year: </label>' + _dataModel2.default.massageData(response.Year) + '</div> \n                            <div><label>Genre: </label>' + _dataModel2.default.massageData(response.Genre) + '</div> \n                            <div><label>Director: </label>' + _dataModel2.default.massageData(response.Director) + '</div>\n                        </span>\n                    </li>';

                _this.dataModel.addToModelCollection(self.sequence, response);
                return { details: details };
            }).then(function (data) {
                _this.domElements.$detailsDiv.prepend(data.details);
            }).catch(function (e) {
                // Do something when no response returned from server
            });
        }
    }, {
        key: '_registerEvents',


        /* register events on UI elements */
        value: function _registerEvents() {
            var self = this;
            this.domElements.$mainContainer.on("keyup", "#title", function (event) {
                self.domElements.$titleInput.removeClass("error");
                if (event.key != "Backspace") {
                    self._getDetails(_constants.URL.BASE_URL + _constants.URL.TITLE_KEY + self.domElements.$titleInput.val());
                }
            });

            this.domElements.$mainContainer.on("keyup", "#year", function (event) {
                if (self.domElements.$titleInput.val() == "") {
                    // title is required field - if input value empty, it is flagged with error
                    self.domElements.$titleInput.addClass("error");
                } else {
                    if (event.key != "Backspace") {
                        self._getDetails(_constants.URL.BASE_URL + _constants.URL.TITLE_KEY + self.domElements.$titleInput.val() + _constants.URL.YEAR_KEY + self.domElements.$yearInput.val());
                    }
                }
            });

            this.domElements.$mainContainer.on("click", "#posterImg", function (event) {
                var key = $(event.toElement).data().key;
                if (!self.dataModel.isMoreDetailsShown(key)) {
                    self.dataModel.setMoreDetailsShown(key);
                    self._appendData(key);
                }
            });
        }
    }, {
        key: '_appendData',


        /* Method to show more data in UI for each item */
        value: function _appendData(key) {
            var moreData = this.dataModel.getFilteredData(key);
            var moreDataElements = '<div><label>Actors: </label>' + moreData.Actors + '</div>\n                                <div><label>Released: </label>' + moreData.Released + '</div>\n                                <div><label>Awards: </label>' + moreData.Awards + '</div>\n                                <div><label>Country: </label>' + moreData.Country + '</div>';

            this.domElements.$mainContainer.find('li[data-key = ' + key + '] #highlights').append($(moreDataElements));
        }
    }, {
        key: '_getDomElements',


        /* Method used to grab the elements from the DOM */
        value: function _getDomElements() {
            var titleInput = "title-input";
            var yearInput = "year-input";

            var detailsDiv = "details";
            var posterDiv = "poster";

            var $mainContainer = $("#" + this.containerId);
            var $titleInput = $mainContainer.find("#" + titleInput);
            var $yearInput = $mainContainer.find("#" + yearInput);
            var $detailsDiv = $mainContainer.find("#" + detailsDiv);
            var $posterDiv = $mainContainer.find("#" + posterDiv);

            return { $mainContainer: $mainContainer, $titleInput: $titleInput, $yearInput: $yearInput, $detailsDiv: $detailsDiv, $posterDiv: $posterDiv };
        }
    }, {
        key: '_instantiateModel',


        /* Model instatiated that is in sync with UI */
        value: function _instantiateModel() {
            return new _dataModel2.default();
        }
    }]);

    return MainContent;
}();

exports.default = MainContent;
;

},{"./api.js":1,"./constants.js":3,"./dataModel.js":4}]},{},[2]);
