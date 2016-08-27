/**
 * Created by gabriel.lagos on 25/08/2016.
 */
import React from 'react';

const default_dataset = "Brisbane";
const baseUrl = "http://journeyplanner.silverrailtech.com";
const API_KEY = "9331C64E-5A58-492E-AC03-DB827177F39E";
exports.getJourneys = function( date, from, to) {
    let uri = `${baseUrl}/journeyplannerservice/v2/rest/DataSets/${default_dataset}/JourneyPlan?ApiKey=${API_KEY}&format=json&MappingDataRequired=false&maxJourneys=5&RealTimeMode=Annotate&mapDataContent=none&date=${date}&from=${from}&to=${to}`;
    console.log(uri);

    return fetch(uri)
        .then((response) => response.text())
        .then((responseText) => {
            // console.log("raw response = [%s]", responseText);
            var response = JSON.parse(responseText);
            if (response.Status.Severity != 0) {
                console.log("No Journeys found!");
            }
            if (response.Journeys) {
                console.log(`Found ${response.Journeys.length} Journeys`);
            }
            // console.log(`JUST GOT RESPONSE: ${JSON.stringify(response, null, 4)}`);
            return response;
        })
        .catch((error) => {
            console.warn(error);
            return null;
        });
};

exports.getLocalities = function(searchTerm) {
    let uri = `${baseUrl}/journeyplannerservice/v2/rest/DataSets/${default_dataset}/Localities?searchTerm=${searchTerm}&ApiKey=${API_KEY}&format=json`;

    console.log(uri);
    return fetch(uri)
        .then((response) => response.text())
        .then((responseText) => {
            debugger;
            console.log("raw response = [%s]", responseText);
            var response = JSON.parse(responseText);
            if (response.Status.Severity != 0) {
                console.log("No Addresses found!");
            }
            if (response.Localities) {
                console.log(`Found ${response.Localities.length} LOCALITIES`);
                return response.Localities;
            }

            return [];
        })
        .catch((error) => {
            console.warn(error);
            return [];
        });

};