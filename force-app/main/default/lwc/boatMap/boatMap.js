import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

const LATITUDE_FIELD = 'Boat__c.Geolocation__Latitude__s';
const LONGITUDE_FIELD = 'Boat__c.Geolocation__Longitude__s';
const BOAT_FIELDS = [LONGITUDE_FIELD, LATITUDE_FIELD];

export default class BoatMap extends LightningElement {
  // private
  subscription = null;
  _boatId;

  @api boatId;

  // Getter and Setter to allow for logic to run on recordId change
  // this getter must be public
  @api
  get recordId() {
    return this._boatId;
  }
  set recordId(value) {
    this.setAttribute('boatId', value);
    this._boatId = value;
  }

  error = undefined;
  mapMarkers = [];

  // Initialize messageContext for Message Service
  @wire(MessageContext)
  messageContext;

  // Getting record's location to construct map markers using recordId
  // Wire the getRecord method using ('$boatId')
  @wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS })
  wiredRecord({ error, data }) {
    // Error handling
    if (data) {
      this.error = undefined;
      const longitude = data.fields.Geolocation__Longitude__s.value;
      const latitude = data.fields.Geolocation__Latitude__s.value;
      this.updateMap(longitude, latitude);
    } else if (error) {
      this.error = error;
      this._boatId = undefined;
      this.mapMarkers = [];
    }
  }

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        BOATMC,
        (message) => {
          this._boatId = message.recordId;
        },
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }
  // Calls subscribeMC()
  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  // Creates the map markers array with the current boat's location for the map.
  updateMap(Longitude, Latitude) {
    this.mapMarkers = [{ location: { Latitude, Longitude } }];
  }

  // Getter method for displaying the map component, or a helper method.
  get showMap() {
    return this.mapMarkers.length > 0;
  }
}
