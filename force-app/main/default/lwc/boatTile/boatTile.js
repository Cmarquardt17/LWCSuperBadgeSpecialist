import { LightningElement, wire, api } from 'lwc';
const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

export default class BoatTile extends LightningElement {
    @api boat;

    @api selectedBoatId;

    subscription = null;

    // Getter for dynamically setting the background image for the picture
    get backgroundStyle() { 
        if (this.boat) {
            return `background-image:url(${this.boat.Picture__c})`;
        }
    }
    
    // Getter for dynamically setting the tile class based on whether the
    // current boat is selected
    get tileClass() {
        if (this.selectedBoatId === this.boat.Id) {
            return TILE_WRAPPER_SELECTED_CLASS;
        } else {
            return TILE_WRAPPER_UNSELECTED_CLASS;
        }
    }

    @wire(MessageContext)
    messageContext;

    // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                BOATMC,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    // Handler for message received by component
    handleMessage(message) {
        this.selectedBoatId = message.boatId;
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    // Fires event with the Id of the boat that has been selected.
    selectBoat() {
        this.selectedBoatId = this.boat.Id;
        this.selectedBoatTypeId = this.boat.Id;
        const boatSelectEvent = new CustomEvent('boatselect', {
            detail: { boatId: this.selectedBoatId}
        });
        this.dispatchEvent(boatSelectEvent);
    }
  }