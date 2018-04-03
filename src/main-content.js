import API from './api.js';
import {URL} from './constants.js';
import DataModel from "./dataModel.js"

export default class MainContent {
    constructor(conf) {
        this.containerId = conf.containerId;
        this.sequence = 0; // Used as a key to maintain the data in the model
    }

    /* method to render & initialize classes */
    render() {
        this.dataModel = this._instantiateModel();
        this.domElements = this._getDomElements();
        this._registerEvents();
        this._getDetails(URL.BASE_URL + URL.TITLE_KEY + URL.INITIAL_MOVIE_TITLE + "&y=2014");
    };

    /* get movie details and attach to the dom, so as to be showcased on the UI */
    _getDetails(url) {
        var self = this;

        let data = API._fetchDetails(url);
        let content = data.then((response) => {

            if (!response || this.dataModel.isPreviousSame(self.sequence, response.Title)) {
                return Promise.reject();
            }

            ++self.sequence;
            var poster = response.Poster != "N/A" || !response.Poster ? response.Poster : URL.POSTER;
            let details = `<li data-key=${self.sequence} style="border-top:2px green solid;float:left;clear:both;width: 800px;" class="collection-item">
                        <span style="float:left;">
                            <img id="posterImg" data-key=${self.sequence} src=${poster} alt=""> 
                        </span>
                        <span id="highlights" style="margin-left:20px; float:left">
                            <div><label>Title: </label>${response.Title}</div>
                            <div><label>Year: </label>${DataModel.massageData(response.Year)}</div> 
                            <div><label>Genre: </label>${DataModel.massageData(response.Genre)}</div> 
                            <div><label>Director: </label>${DataModel.massageData(response.Director)}</div>
                        </span>
                    </li>`;

            this.dataModel.addToModelCollection(self.sequence, response);
            return {details};
        }).then((data) => {
            this.domElements.$detailsDiv.prepend(data.details);
        }).catch(e => {
            // Do something when no response returned from server
        })
    };

    /* register events on UI elements */
    _registerEvents() {
        var self = this;
        this.domElements.$mainContainer.on("keyup", "#title", (event) => {
            self.domElements.$titleInput.removeClass("error");
            if (event.key != "Backspace") {
                self._getDetails(URL.BASE_URL + URL.TITLE_KEY + self.domElements.$titleInput.val());
            }
        });

        this.domElements.$mainContainer.on("keyup", "#year", (event) => {
            if (self.domElements.$titleInput.val() == "") {
                // title is required field - if input value empty, it is flagged with error
                self.domElements.$titleInput.addClass("error");
            } else {
                if (event.key != "Backspace") {
                    self._getDetails(URL.BASE_URL
                        + URL.TITLE_KEY
                        + self.domElements.$titleInput.val()
                        + URL.YEAR_KEY
                        + self.domElements.$yearInput.val());
                }
            }
        });

        this.domElements.$mainContainer.on("click", "#posterImg", (event) => {
            let key = $(event.toElement).data().key;
            if (!self.dataModel.isMoreDetailsShown(key)) {
                self.dataModel.setMoreDetailsShown(key);
                self._appendData(key);
            }
        });
    };

    /* Method to show more data in UI for each item */
    _appendData(key) {
        let moreData = this.dataModel.getFilteredData(key);
        let moreDataElements = `<div><label>Actors: </label>${moreData.Actors}</div>
                                <div><label>Released: </label>${moreData.Released}</div>
                                <div><label>Awards: </label>${moreData.Awards}</div>
                                <div><label>Country: </label>${moreData.Country}</div>`;

        this.domElements.$mainContainer.find(`li[data-key = ${key}] #highlights`).append($(moreDataElements));
    };

    /* Method used to grab the elements from the DOM */
    _getDomElements() {
        let titleInput = "title-input";
        let yearInput = "year-input";

        let detailsDiv = "details";
        let posterDiv = "poster";

        let $mainContainer = $("#" + this.containerId);
        let $titleInput = $mainContainer.find("#" + titleInput);
        let $yearInput = $mainContainer.find("#" + yearInput);
        let $detailsDiv = $mainContainer.find("#" + detailsDiv);
        let $posterDiv = $mainContainer.find("#" + posterDiv);

        return {$mainContainer, $titleInput, $yearInput, $detailsDiv, $posterDiv}
    };

    /* Model instatiated that is in sync with UI */
    _instantiateModel() {
        return new DataModel();
    }

};