/**
 * Created by vidushi on 3/30/18.
 * Model class to store and operate on model
 */

export default class DataModel {
    constructor(conf) {
        this.model = {}
    }

    /* adds a new response data to the model */
    addToModelCollection(key, value) {
        this.model[key] = value;
    }

    /* Filters the data based on key from model & returns only the UI presentable fields */
    getFilteredData(dataKey) {
        let self = this;
        let keysModel;
        Object.keys(this.model).forEach(function (key) {
            if (key == dataKey) {
                keysModel = self.model[key];
                return;
            }
        });

        return {
            Actors: (()=>{return DataModel.massageData(keysModel.Actors)})(),
            Released: (()=>{return DataModel.massageData(keysModel.Released)})(),
            Awards: (()=>{return DataModel.massageData(keysModel.Awards)})(),
            Country: (()=>{return DataModel.massageData(keysModel.Country)})()
        }
    }

    /* Static method to massage the non-available data for the UI presentation */
    static massageData(dataValue) {
        return (dataValue == "N/A" ? "Not Available" : dataValue);
    }

    /* Method to update the model with a flag indicating that more details are already rendered on the UI */
    setMoreDetailsShown(dataKey) {
        this.model[dataKey] && (this.model[dataKey].showDetails = true);
    }

    /* Indicates if the more details are already shown on UI */
    isMoreDetailsShown(dataKey) {
        return this.model[dataKey] && this.model[dataKey].showDetails || undefined;
    }

    /* Method to check if the top most model item is same as current requested item */
    isPreviousSame(dataKey, title) {
        if (this.model[dataKey] && this.model[dataKey].Title == title) {
            return true;
        }
    }
};