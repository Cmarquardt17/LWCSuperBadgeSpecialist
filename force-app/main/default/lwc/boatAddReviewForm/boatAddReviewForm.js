// imports
import { api, LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import BOAT_REVIEW_OBJECT from '@salesforce/schema/BoatReview__c'
import NAME_FIELD from '@salesforce/schema/BoatReview__c.Name'
import COMMENT_FIELD from '@salesforce/schema/BoatReview__c.Comment__c'

const SUCCESS_TITLE = 'Review Created!';
const SUCCESS_VARIANT = 'success';

export default class BoatAddReviewForm extends LightningElement {
    // Private
    boatId;
    rating;
    boatReviewObject = BOAT_REVIEW_OBJECT;
    nameField        = NAME_FIELD;
    commentField     = COMMENT_FIELD;
    labelSubject = 'Review Subject';
    labelRating  = 'Rating';
    
    // Public Getter and Setter to allow for logic to run on recordId change
    @api
    get recordId() { 
        return this.boatId;
    }
    set recordId(value) {
        console.log('BOATID: ', value);
        this.boatId = value;
      //sets boatId attribute
      //sets boatId assignment
    }
    
    // Gets user rating input from stars component
    handleRatingChanged(event) { 
        this.rating = event.detail.rating;
    }
    
    // Custom submission handler to properly set Rating
    // This function must prevent the anchor element from navigating to a URL.
    // form to be submitted: lightning-record-edit-form
    handleSubmit(event) { }
    
    // Shows a toast message once form is submitted successfully
    // Dispatches event when a review is created
    handleSuccess() {
      // TODO: dispatch the custom event and show the success message
        const toast = new ShowToastEvent({
            title: SUCCESS_TITLE,
            variant: SUCCESS_VARIANT,
            mode: 'dismissable'
        });
        this.dispatchEvent(toast);
        this.handleReset();
    }
    
    // Clears form data upon submission
    // TODO: it must reset each lightning-input-field
    handleReset() { }
}