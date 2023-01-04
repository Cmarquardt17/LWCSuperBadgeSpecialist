import { LightningElement, wire, api } from 'lwc';
import getBoatsByLocation  from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';

export default class BoatsNearMe extends LightningElement {
    @api boatTypeId;
    mapMarkers = [];
    isLoading = true;
    isRendered;
    latitude;
    longitude;

    // Add the wired method from the Apex Class
    // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
    // Handle the result and calls createMapMarkers
    @wire(getBoatsByLocation, {latitude: '$latitude', longitude: '$longitude', boatTypeId: '$boatTypeId'})
    wiredBoatsJSON({error, data}) {
        console.log('HELLO');
        if (data) {
            this.createMapMarkers(data);
        } else if (error) {
            const evt = new ShowToastEvent({
                title: ERROR_TITLE,
                message: errorMessage,
                variant: ERROR_VARIANT,
            });
            this.dispatchEvent(evt);
        }
        this.isLoading = false;
    }

    // Controls the isRendered property
    // Calls getLocationFromBrowser()
    renderedCallback() {
        if (!this.isRendered) {
            this.getLocationFromBrowser();
        }
        this.isRendered = true;
    }

    // Gets the location from the Browser
    // position => {latitude and longitude}
    getLocationFromBrowser() {
        navigator.geolocation.getCurrentPosition(
            position => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
            },
            (e) => {
            
            }, {
                enableHighAccuracy: true
            }
        );
    }

    // Creates the map markers
    createMapMarkers(boatData) {
        const newMarkers = JSON.parse(boatData).map(boat => { 
            return {
                location: {
                    Latitude: boat.Geolocation__Latitude__s,
                    Longitude: boat.Geolocation__Longitude__s
                },
                title: boat.Name,
            };
        });
        newMarkers.unshift({
            location: {
                Latitude: this.latitude,
                Longitude: this.longitude,
            },
            title: LABEL_YOU_ARE_HERE,
            icon: ICON_STANDARD_USER,
        });
        this.mapMarkers = newMarkers;
    }
}