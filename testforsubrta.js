import getsObjectList from '@salesforce/apex/smsObjectController.getsObjectList';
import getRemainingsObjectList from '@salesforce/apex/smsObjectController.getRemainingsObjectList';
import fetchFieldApiFromObject from '@salesforce/apex/smsObjectController.fetchFieldApiFromObject';
import fetchFieldNameApiFromObject from '@salesforce/apex/smsObjectController.fetchFieldNameApiFromObject'
import getObjectDataTable from '@salesforce/apex/smsObjectController.getObjectDataTable';
import updateObjectDataTable from '@salesforce/apex/smsObjectController.updateObjectDataTable';
import deleteRecordSmsConfig from '@salesforce/apex/smsObjectController.deleteRecordSmsConfig';
import getSmsTemplateData from '@salesforce/apex/smsObjectController.getSmsTemplateData';
import getSearchData from '@salesforce/apex/smsObjectController.getSearchData';
import save from '@salesforce/apex/smsObjectController.save';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { LightningElement, api, track } from 'lwc';
var nameSpacePrefix = 'tdc_tsw__';
export default class ObjectSetup extends NavigationMixin (LightningElement) {
@api islightning = false;
pageNumber = 1;
totalRecords = 0;
totalPages;
pageSize;
recordsToDisplay = [];
initialRecords = [];
columnlist; 
smsConfigRecordTableShow;
booleanValueOfAllowMultipleName;
NameApiField = false;
enableDisableValuePhoneApi = false;
@track editInlineColumns = false;
smsConfigRecord = [];
@track optionsOfObject = [];
@track optionsOfPhoneApi = [];
@track optionsOfDefaultPhoneApi = [];
@track optionsOfOptinTemplate = [];
selectedDefaultPhoneApi;
selectedOptinTemplate = [];
@track ValueOfEnableScheduler = false;
@track selectedPhoneApi = [];
@track selectedPhoneApiDetail = [];
@track optionsOfNameApi = [];
@track pickListOptions;
@track rowid_show;
selectedNameApi;
selectedObject = '';
viewRecordNo = '200';
placeholderOfSearchValue = 'Search';
searchValue;
editSelectedOptInTemplateValue = [];
@track removeText = false;
@track removeText_selected = false;
editEnableSchedulerValueGet;
columns(){
  this.columnlist = [
    {label:'Name', fieldName:'Name'},
    {label:'NameAPI', fieldName:[nameSpacePrefix+'NameFieldApiName__c']},
    {label:'Phone API', fieldName:[nameSpacePrefix+'Phone_Apis__c']},
    {label:'Default Phone API', fieldName:[nameSpacePrefix+'Default_Phone_Api__c']},
    {label:'Opt-in Templates', fieldName:[nameSpacePrefix+'Compliance_Template__c'], type: 'picklistColumn' , editable:this.editInlineColumns, typeAttributes:{multiple: true ,placeholder: 'Choose Type',
    options:{fieldName:'pickListOptions'}, 
    value: { fieldName: [nameSpacePrefix+'Compliance_Template__c'] },
    context: { fieldName: 'Id' }}},
    {label:'Enable Scheduler', fieldName: [nameSpacePrefix+'Enable_Scheduler__c'], type:'boolean', editable:this.editInlineColumns,
    typeAttributes: {iconName: 'utility:check', alternativeText: 'Enable Scheduler', label: { fieldName: 'Enable_Scheduler__c' }, checked: { fieldName: 'Enable_Scheduler__c' }}},
   {label: 'Action', type: 'button', typeAttributes: { label: 'Edit', name: 'edit', title: 'Edit',variant: 'base'}},
   {type: 'button', typeAttributes: { label: 'Delete', name: 'delete', title: 'Delete', variant: 'destructive', iconName: 'utility:delete'}}
  ];
}

recordsPerPage = [
  {
    label:'5',
    value:'5'
  },
  {
    label:'10',
    value:'10'
  },
  {
    label:'15',
    value:'15'
  },
  {
    label:'20',
    value:'20'
  },
  {
    label:'50',
    value:'50'
  },
  {
    label:'100',
    value:'100'
  },
  {
    label:'200',
    value:'200'
  }
];

get bDisableFirst() {
  return this.pageNumber == 1;
}
get bDisableLast() {
  return this.pageNumber == this.totalPages;
}

previousPage() {
  this.pageNumber = this.pageNumber - 1;
  this.paginationHelper();
}
nextPage() {
  this.pageNumber = this.pageNumber + 1;
  this.paginationHelper();
}
firstPage() {
  this.pageNumber = 1;
  this.paginationHelper();
}
lastPage() {
  this.pageNumber = this.totalPages;
  this.paginationHelper();
}

paginationHelper() {
  this.recordsToDisplay = [];
  // calculate total pages
  this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  console.log('totalPages---> ',this.totalPages);
  // set page number 
  if (this.pageNumber <= 1) {
      this.pageNumber = 1;
  } else if (this.pageNumber >= this.totalPages) {
      this.pageNumber = this.totalPages;
  }
  // set records to display on current page 
  for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
      if (i === this.totalRecords) {
          break;
      }
      this.recordsToDisplay.push(this.smsConfigRecord[i]);
      this.initialRecords.push(this.smsConfigRecord[i]);
  }
}
connectedCallback(){
  this.editInlineColumns = false;
  this.columns();
  getObjectDataTable({numberOfRecordShow:this.viewRecordNo})
  .then(result=>{
    this.smsConfigRecord = result;
    this.totalRecords = this.smsConfigRecord.length;
    console.log('totalRecords--->',this.totalRecords);
    this.pageSize = this.viewRecordNo;
    console.log('pageSize--->',this.pageSize);
    this.paginationHelper();  //Call Pagination Function.
    if(this.smsConfigRecord.length>0){
        this.getRemainingSObject();
        this.smsConfigRecordTableShow = true;
    }
    else{
      this.smsConfigRecordTableShow = false;
      this.sObjectList();
    }
  })
  .catch(error=>{
    console.log('error',JSON.stringify(error));
  })
  this.selectedObject = '';
  this.optionsOfObject = [];
  this.selectedPhoneApi = [];
  this.selectedPhoneApiDetail = [];
  this.optionsOfPhoneApi = [];
  this.optionsOfDefaultPhoneApi = [];
  this.selectedDefaultPhoneApi;
  this.optionsOfOptinTemplate = [];
  this.selectedOptinTemplate = [];
  this.editSelectedOptInTemplateValue = [];
  this.ValueOfEnableScheduler =false;
  this.selectedNameApi = '';
 }

getRemainingSObject(){
  const length = this.smsConfigRecord.length;
  let arrayOfSelectSObject = [];
  for(let i=0;i<length;i++){
    arrayOfSelectSObject.push(this.smsConfigRecord[i].Name);
  }

  getRemainingsObjectList({sObjectValue:arrayOfSelectSObject})  //getting Remaining Object list.
    .then(result=>{
      
      let options = Object.keys(result).map(key => ({
        label: result[key],
        value: key,
      }));
      this.optionsOfObject = options;
    })
    .catch(error => {
      console.log(JSON.stringify(error));
    });
}
sObjectList(){   //getting Object list.
  getsObjectList({})
  .then(result => {
    let options = Object.keys(result).map(key => ({
      label: result[key],
      value: key,
    }));
    this.optionsOfObject = options;
    //console.log('result of sObject--->', JSON.stringify(this.optionsOfObject));
  })
  .catch(error => {
    console.log('error---->',JSON.stringify(error));
  });

}

handlechangeselectedObject(event){   //OnChange method of select Object in org.
this.selectedObject = event.target.value;
//console.log('selectedObject>>>>> ',this.selectedObject);
fetchFieldApiFromObject({objType:this.selectedObject}) //getting Phone Api list.
.then(result=>{
  let options = Object.keys(result).map(key => ({
    label: result[key],
    value: key,
  }));
   this.optionsOfPhoneApi = options;
})
.catch(error=>{
console.log('error',JSON.stringify(error));
})

fetchFieldNameApiFromObject({objType:this.selectedObject}) //getting Name Api list.
.then(result=>{
  let options = Object.keys(result).map(key => ({
    label: result[key],
    value: key,
  }));
   this.optionsOfNameApi = options;
   //console.log('optionsOfNameApi------>',JSON.stringify(this.optionsOfNameApi));
})
.catch(error=>{
console.log('error',JSON.stringify(error));
})

this.functionOfGetTemplate(this.selectedObject);
this.selectedPhoneApiDetail = [];
this.selectedPhoneApi = [];
}

functionOfGetTemplate(sObject){  // this is function for use of getting SMS template records.
  getSmsTemplateData({objectName:sObject})
  .then(result=>{
    //console.log('Options>>>> ',JSON.stringify(result));
     let options = [];
    result.forEach(variable=>{options.push({label:variable.Name, value:variable.Name});});
    options.unshift({ label: 'Select All', value: 'All', 'data-select-all': true });
    options.unshift({ label: '---None---', value: '---None---'});
   this.optionsOfOptinTemplate = options;
    this.smsConfigRecord.forEach(ele=>{
      ele.pickListOptions = this.optionsOfOptinTemplate;
    }) 
    this.columns();
   }).catch(error=>{console.log(JSON.stringify(error));})
}
handlechangePhoneApi(event){   //OnChange method on Phone Api.
this.selectedPhoneApi.push(event.target.value);
this.selectedPhoneApiDetail = this.selectedPhoneApi.map((name, index) => {
  return { name:name, sno: index + 1 };  
});
if(this.selectedPhoneApi.length>0){
  let options = [];
  this.selectedPhoneApi.forEach(variable=>{
  options.push({
    label:variable,
    value:variable,
   
  });
});
this.optionsOfDefaultPhoneApi = options; //Added selected PhoneApi in List of DefaultPhoneApi.
}
}

handleOnDefaultPhoneApi(event){   //onchange method of DefaultPhoneAPI.
  this.selectedDefaultPhoneApi = event.target.value;
}

handleOnOptinTemplate(event){   //Select Sms Template onchange method.
   const selectedValue = event.detail.value;
   const selectedOption = this.optionsOfOptinTemplate.find(option => option.value === selectedValue);
   if(selectedOption['data-select-all']){
    this.optionsOfOptinTemplate.forEach(option=>{
         option.selected = true;
    });
    let collectEditValue = this.optionsOfOptinTemplate.filter(option => option.value !== 'All' && option.value !== '---None---').map(option => option.value);
    this.selectedOptinTemplate = collectEditValue;
   }
   else{
    if (selectedValue && !this.selectedOptinTemplate.includes(selectedValue) && selectedValue!='---None---') {
      //console.log('selectedValue-----> ',selectedValue);
      if(this.selectedOptinTemplate.includes('---None---')){
        const index = this.selectedOptinTemplate.indexOf('---None---');
        const array = this.selectedOptinTemplate.splice(index, 0);
        this.selectedOptinTemplate = array;
        //console.log('selectedOptinTemplate 242---->',JSON.stringify(this.selectedOptinTemplate));
        this.selectedOptinTemplate = [...this.selectedOptinTemplate, selectedValue];
      }
      else if(!this.selectedOptinTemplate.includes('---None---')){
        this.selectedOptinTemplate = [...this.selectedOptinTemplate, selectedValue];
        //console.log('selectedOptinTemplate 247---->',JSON.stringify(this.selectedOptinTemplate));
      }
      //this.selectedOptinTemplate.push(selectedValue);
    }
    else if(selectedValue == '---None---'){
        this.selectedOptinTemplate = [];
        this.selectedOptinTemplate.push('---None---');
    }
   }
   this.renderedCallback();
    //console.log('selectedOptinTemplate 256---->',JSON.stringify(this.selectedOptinTemplate));
}

booleanValueOfEnableScheduler(event){    //Enable Schedular onchange method.
  let booleanvalue = event.target.checked;
  this.ValueOfEnableScheduler = booleanvalue;
}
  
handleNumberRecordChange(event){    //How many record show onchange method.
this.viewRecordNo = event.target.value;
this.pageSize = this.viewRecordNo;
getObjectDataTable({numberOfRecordShow:this.viewRecordNo})
  .then(result=>{
    this.smsConfigRecord = result;
    this.totalRecords = result.length;
    this.paginationHelper();
  })
  .catch(error=>{
    console.log('error',error);
  })
}

handleRowAction(event) {     //Lightning Datatable Row action.
  const action = event.detail.action;
  const row = event.detail.row;
  this.rowid_show=row.Id;
  switch (action.name) {
      case 'edit':
         this.editInlineColumns = true;
         this.columns();
         this.functionOfGetTemplate(row.Name);
          break;
      case 'delete':
        deleteRecordSmsConfig({recordIdOfSmsConfig:row.Id})
        .then(result=>{
          if(result){
            this.connectedCallback();
          }
        }).catch(error=>{if(error){
          this.dispatchEvent(
            new ShowToastEvent({
            title: 'Failure',
            variant: 'error',
            message: {error},
            }),
            );
        }

          console.log(error);
        })
          break;
      default:
  }
}

handleCellChange(event){   //this method use for tracking edit values on Datatable cells.
  let updateValueOfEnableSchedule = event.detail.draftValues[0][nameSpacePrefix+'Enable_Scheduler__c'];
  const selectedValue = event.detail.draftValues[0][nameSpacePrefix+'Compliance_Template__c'];
  if(selectedValue!=undefined){
  const selectedOption = this.optionsOfOptinTemplate.find(option => option.value === selectedValue);
  if(selectedOption['data-select-all']){
    this.optionsOfOptinTemplate.forEach(option=>{
         option.selected = true;
    });
    let collectEditValue = this.optionsOfOptinTemplate.filter(option => option.value !== 'All' && option.value !== '---None---').map(option => option.value);
    this.editSelectedOptInTemplateValue = collectEditValue;
   }else{
    this.editSelectedOptInTemplateValue.push(selectedValue);
    console.log('editSelectedOptInTemplateValue---->', JSON.stringify(this.editSelectedOptInTemplateValue));
   }
   this.renderedCallback();
  }
    if(updateValueOfEnableSchedule!=undefined){
        this.editEnableSchedulerValueGet = updateValueOfEnableSchedule;
    }
}

handleSave(event){   // On Edit Button, Save button.
  const rowId = event.detail.draftValues[0].Id;
  updateObjectDataTable({smsConfigId:rowId, enableScheduler:this.editEnableSchedulerValueGet, smsTemplate:this.editSelectedOptInTemplateValue})
  .then(result=>{
    if(result){
      this.connectedCallback();
      this.removeText = true; 
      this.removeText_selected = true; 
    }
  })
  .catch(error=>{
    console.log(error);
  })
}
handleCancel(event){    // On Edit button, cancle button. 
  console.log(event.detail);
this.connectedCallback();
}

handleSearchRecord(event){  //Search value handle and save variable
  let variable  =  event.target.value;
  console.log('variable_--> ',variable.length);
  if(variable.length == 0){
    this.connectedCallback();
  }

  else if(variable.length > 1){
    this.searchValue = variable;
    this.getSearchDataOfSmsConfig();
  }
  //else if(variable.length == 1){
  //   this.placeholderOfSearchValue = 'Search';
  //  console.log('Only 1 character are not allowed!');
  // }
}

getSearchDataOfSmsConfig(){    //Search box value get by apex.
  getSearchData({searchData:this.searchValue})
  .then(result=>{
    if(result.length == 0){
      this.smsConfigRecordTableShow = false;
    }
    else{
      this.smsConfigRecord = result;
      this.smsConfigRecordTableShow = true;
    }
  })
  .catch(error=>{
    console.log(error);
  })
}

checkBoxBooleanValue(event){ //Allow Multiple Name Mapping.
   this.booleanValueOfAllowMultipleName = event.detail.checked;
  if(this.booleanValueOfAllowMultipleName == true){
    this.enableDisableValuePhoneApi = true;
    this.enableDisableNameApi = false;
    this.NameApiField = true;
  }else{
    this.enableDisableValuePhoneApi = false;
    this.NameApiField = false;
    this.selectedNameApi = '';

  }

 
}

handlechangeselectedNameApi(event){
  this.selectedNameApi = event.target.value;
  //console.log('selectedNameApi value----> ',this.selectedNameApi);
  this.enableDisableNameApi = true;
  this.enableDisableValuePhoneApi = false;
  fetchFieldApiFromObject({objType:this.selectedObject, nameApi:this.selectedNameApi})
  .then(result=>{
    let options = Object.keys(result).map(key => ({
      label: result[key],
      value: key,
    }));
     this.optionsOfPhoneApi = options;
  })
  .catch(error=>{
  console.log(error);
  })
}

saveButtonClickAction(){   //When want record save in org.
  if(this.selectedObject ==undefined || this.selectedObject ==null || this.selectedObject == ''){
    this.dispatchEvent(
      new ShowToastEvent({
      title: 'Failure',
      variant: 'error',
      message: 'Please Select Object API',
      }),
      );
  }
else if(this.selectedPhoneApi == undefined || this.selectedPhoneApi.length == 0){
  this.dispatchEvent(
    new ShowToastEvent({
    title: 'Failure',
    variant: 'error',
    message: 'Please Select Phone API',
    }),
    );
  }
 else if((this.selectedObject!=undefined && this.selectedObject!=null && this.selectedObject!='') && (this.selectedPhoneApi!=undefined && this.selectedPhoneApi.length!=0)){
  if(this.selectedNameApi == undefined || this.selectedNameApi == '' || this.selectedNameApi == null){
    let valueofNameApi = '';
    if(this.selectedObject == 'Case'){
      valueofNameApi = this.optionsOfNameApi.find(option=>option.value == 'CaseNumber');
    }
    else if(this.selectedObject == 'WorkOrder'){
      valueofNameApi = this.optionsOfNameApi.find(option=>option.value == 'WorkOrderNumber');
    }
    else{
      valueofNameApi = this.optionsOfNameApi.find(option=>option.value == 'Name');
    }
    this.selectedNameApi = valueofNameApi.value;
    console.log('selectedNameApi---> ',JSON.stringify(this.selectedNameApi));
  }
    save({objType:this.selectedObject,nameApi:this.selectedNameApi ,phoneApi:this.selectedPhoneApi, defaultPhoneApi:this.selectedDefaultPhoneApi, optInTemplate:this.selectedOptinTemplate, enableScheduler:this.ValueOfEnableScheduler})
    .then(result=>{
      if(result == 'Record Save Successfully'){
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Success',
            variant: 'success',
            message: 'Record Save Successfully',
          }),
          );
        if(this.booleanValueOfAllowMultipleName == true){
          this.enableDisableNameApi = false;
          this.enableDisableValuePhoneApi = true;
        }
      }
      this.connectedCallback();
    })
    .catch(error=>{
      console.log(error);
    })
  }
}
resetButtonClickAction(){   //Reset Button
  this.selectedPhoneApi = [];
  this.selectedPhoneApiDetail = [];
  this.optionsOfDefaultPhoneApi = [];
  this.selectedDefaultPhoneApi;
  this.selectedOptinTemplate = [];
  this.selectedNameApi = [];
  if(this.booleanValueOfAllowMultipleName == true){
    this.enableDisableNameApi = false;
    this.enableDisableValuePhoneApi = true;
  }
}
    renderedCallback() {
      let cssText = '';
        const style = document.createElement('style');
       cssText = `
        lightning-combobox.recordNumberContainer {
          display : flex !important;
          align-items : center !important;
        }
        .recordNumberContainer label{
          margin-left: 10px;
        }
.backgroundCss{
    background: white;
    height: 100vh;
}
.lebelCss{
    background: rgba(1, 118, 211, 1) !important;
    max-width: inherit;
    padding: 8px;
}
.ComboBoxCss {
  flex: 1;
  margin-left: 250px;
  max-width: 200px;
}
.headingCss{
  font-family: 'Raleway', sans-serif;
  font-size: 20px;
  text-align: left;
  font-weight: 100;
  color: #000000;
  padding: 21px;
}
.saveResetCheckboxButton{
  padding: 0px 6px 14px 0px;
    gap: 12px;
    display: flex;
    margin-left: 648px;
    padding: 0px 6px 14px 0px;
}
.Button button{
  box-shadow: rgba(0, 0, 0, 0.3) 0 12px 12px 0;
  background-color: rgba(1, 118, 211, 1);
    background-image: none;
    border: 1px solid #1C887E;
    color: #FFF;
    font-size: 14px;
    padding: 0px 24px;
    border-radius: 0;
    transition: all 0.2s ease-out;
    -webkit-transition: all 0.2s ease-out;
}

.comboboxButton button{
  background: rgba(1, 118, 211, 1);
  background-image: none;
  color: #000000;
}

.Norecordfound{
  margin-top: 57px;
  margin-left: 530px;
  font-size: 48px;
  font-weight: bold;
  font-size: 50px;
  color: rgb(3, 45, 96);
}

.save_reset_button_parent .slds-box {
  border: none;
}

.bluetable_content{
  margin-top: 0px;
}
.bluetable_content .slds-p-around_small{
  padding-top: 0;
}
.comboboxButton .slds-input_faux:not(.slds-combobox__input-value) {
  color: #fff;
}
.comboboxButton svg.slds-icon.slds-icon-text-default.slds-icon_xx-small ,.error_popup svg,.success_popup svg{
  fill: #fff;
}
.bluetable_checkbox .slds-form-element{
  // padding-top: 16px;
  // text-align: center;
  padding: 25px 0 0 40px;
}
.show_pagination .input_field .slds-form-element__label{
  display: none;
}
.success_close_icon svg,.error_close_icon svg{
  fill: #fff;
  cursor: pointer;
}
.error_popup lightning-icon.slds-icon-utility-close.slds-icon_container {
  background: #bc180e;
  border-radius: 50%;
  padding: 5px;
}
.success_popup lightning-icon.slds-icon-utility-check.slds-icon_container {
  background: #52de52;
  padding: 5px;
  border-radius: 50%;
}
.datatable_dynamic :not(tr[data-row-key-value="${this.rowid_show}"]) button.slds-cell-edit__button{
  pointer-events: none !important;
  display: none !important;
}
.datatable_dynamic button.slds-cell-edit__button {
  pointer-events: none;
  display: none;
}

.datatable_dynamic tr[data-row-key-value="${this.rowid_show}"] button.slds-cell-edit__button{
  pointer-events: auto !important;
  display: block !important;
}
.maincontent .slds-template_default{
  padding: 0 !important;
}


      `;
     
      this.selectedOptinTemplate.forEach(item => {
        console.log("item: ", item);
        cssText += `.comboboxButton lightning-base-combobox-item[data-value="${item}"] {
          background-color: rgba(1, 118, 211, 1) !important;
          color: #ffffff !important;
        }`;
      });
      this.editSelectedOptInTemplateValue.forEach(item => {
        console.log("item: ", item);
        cssText += `.datatable_dynamic lightning-base-combobox-item[data-value="${item}"] {
          background-color: rgba(1, 118, 211, 1) !important;
          color: #ffffff !important;
        }`;
      }); 
      
      if (this.removeText_selected) {
        this.selectedOptinTemplate.forEach(item => {
          console.log("item: ", item);
          cssText += `.comboboxButton lightning-base-combobox-item[data-value="${item}"] {
            background-color: grey !important;
            color: #ffffff !important;
          }`;
        });
      }
      this.removeText_selected = false;
      if (this.removeText) {
        this.editSelectedOptInTemplateValue.forEach(item => {
          cssText += `.datatable_dynamic lightning-base-combobox-item[data-value="${item}"] {
            background-color: grey !important ;
            color: #ffffff !important;
          }`;
        });
      }
      this.removeText_selected = false;
      this.removeText_selected = false;


    
      style.innerText = cssText;
     
   
        try {
          this.template.querySelector('.backgroundCss').appendChild(style);
        }
        catch (err) {
          console.log("sss", err)
        }
      }
}