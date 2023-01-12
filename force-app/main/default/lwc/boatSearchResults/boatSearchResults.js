import { LightningElement, wire, api, track } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import { publish, MessageContext } from 'lightning/messageService';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {
  @api selectedBoatId;
  @api boatTypeId = '';
  @track boats;
  isLoading = false;
  columns = [
    { label: 'Name', fieldName: 'Name', editable: true },
    { label: 'Length', fieldName: 'Length__c', editable: true },
    { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true },
    { label: 'Description', fieldName: 'Description__c', editable: true }
  ];

  @wire(MessageContext)
  messageContext;

  @wire(getBoats, { boatTypeId: '$boatTypeId' })
  wiredBoats({ data, error }) {
    if (data) {
      this.boats = data;
    } else if (error) {
      console.log('data.error');
      console.log(error);
    }
    this.notifyLoading(false);
  }

  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api
  searchBoats(boatTypeId) {
    this.isLoading = true;
    this.notifyLoading(true);
    this.boatTypeId = boatTypeId;
  }

  updateSelectedTile(event) {
    this.selectedBoatId = event.detail.boatId;
    this.sendMessageService(this.selectedBoatId);
  }

  sendMessageService(boatId) {
    console.log('Publish');
    publish(this.messageContext, BOATMC, { recordId: boatId });
  }

  handleSave(event) {
    // notify loading
    this.notifyLoading(true);
    const updatedFields = event.detail.draftValues;

    // Update the records via Apex
    updateBoatList({ data: updatedFields })
      .then(() => {
        const toast = new ShowToastEvent({
          title: SUCCESS_TITLE,
          message: MESSAGE_SHIP_IT,
          variant: SUCCESS_VARIANT,
          mode: 'dismissable'
        });
        this.dispatchEvent(toast);
        this.notifyLoading(false);
      })
      .catch((error) => {
        const toast = new ShowToastEvent({
          title: ERROR_TITLE,
          message: 'Failure to Update Records',
          variant: ERROR_VARIANT,
          mode: 'dismissable'
        });
        this.dispatchEvent(toast);
      })
      .finally(() => {
        this.refresh();
      });
  }

  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
    console.log('HERE ENTERED');
    if (isLoading) {
      console.log('HERE NOtIFYLOADING');
      this.dispatchEvent(new CustomEvent('loading'));
    } else {
      this.dispatchEvent(new CustomEvent('doneloading'));
      console.log('HERE ELSE');
    }
  }

  @api
  async refresh() {
    this.isLoading = true;
    this.notifyLoading(true);
    await refreshApex(this.boats);
    this.isLoading = false;
    this.notifyLoading(false);
  }
}
