import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class BoatSearch extends NavigationMixin(LightningElement) {
  isLoading = false;

  // Handles loading event
  handleLoading() {
    console.log('NOTIFY LOAD');
    this.isLoading = true;
    console.log('THIS.loading: ', this.isLoading);
  }

  // Handles done loading event
  handleDoneLoading() {
    this.isLoading = false;
    console.log('THIS.loading: DONE ', this.isLoading);
  }

  // Handles search boat event
  // This custom event comes from the form
  searchBoats(event) {
    const boatTypeId = event.detail.boatTypeId;
    this.template.querySelector('c-boat-search-results').boatTypeId = boatTypeId;
    console.log('TEST: ' + this.template.querySelector('c-boat-search-results'));
    this.handleDoneLoading();
  }

  createNewBoat() {
    this[NavigationMixin.Navigate]({
      type: 'standard__objectPage',
      attributes: {
        objectApiName: 'Boat__c',
        actionName: 'new'
      }
    });
  }
}
