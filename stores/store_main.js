import {useStoreState, useStoreActions, useStoreRehydrated, useStore} from 'easy-peasy';
import { createStore, action, thunk } from 'easy-peasy';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {debug} from '../utilities/util_debug.js';

const settingsKey = 'settings1'; // KEY USED TO STORE DATA


const storageSave = async(key, value)=>{
    // await SecureStore.setItemAsync(key, value);
    // await AsyncStorage.setItem(key, value);
    console.log(`SAVED KEY:${key},VALUE:${value}`);
}
  
const storageLoad= async(key)=>{
    // let result = await SecureStore.getItemAsync(key);
    // let result = await AsyncStorage.getItem(key);
    if (result) {
      console.log(`LOADED KEY:${key},VALUE:${result}`);
      return result;

    } else {
      console.log('FAILED TO GET SAVED VALUE');
    }
}

const storageDelete = async (key)=>{
  console.log('DELETING SAVED VALUE OF KEY: '+key);
//   await SecureStore.deleteItemAsync(key);
//   await SecureStore.deleteItemAsync(key);
    // await AsyncStorage.removeItem(key);
}

//DECLAIRE SETTINGS TO BE SAVED HERE
const settingsToSave = ['direction','userName','default','firstName','surName'];
export const settingsStore = createStore({
    //GLOBAL STATES
    isChangingSetting:true,
    settingBeingChanged:'default',
    dummy:'',

    roomId:'',
    roomIsConnected:false,
    userIsAdmin:false,
    userToken:'userToken0',
    userName:'username0',
    userSocketId:'socketId0',

    lastCommandTarget:'',
    lastCommandType:'',
    lastCommandValue:'',
    lastCommandTimeStamp:0,

    videoUrl:'',
    videoUrlNew:'',
    videoUrlNewType:'zxzj',


    //SETTINGS
    default: {
      title:'Set Default',
      value:'default Setting',
      type:'text',// text or options
      description:'Please Select Valid Setting',
    },
    userName: {
      title:'Set Username',
      value:'The Teminator',
      type:'text',
      description:'This is Your Username',
    },
    store_setState:action((state, payload)=>{
        state[payload.state]= payload.value;
    }),
    setValue:action((state, payload)=>{
      state[payload.setting]= payload.data;
    }),
    setValueOnly:action((state, payload)=>{
      console.log(payload.setting);
      console.log(payload.data);
      state[payload.setting].value= payload.data;
    }),
    loadSettingsFromStorage:thunk(async (actions, payload)=>{
        const stringData =  await storageLoad(settingsKey);
        const loadOnlyValue = false;
        if(stringData!=null){
          const Obj = JSON.parse(stringData);
          settingsToSave.map((setting) => {
            const data = Obj[setting];
            if(data!=null){
              if(loadOnlyValue==true){
                actions.setValueOnly({setting:setting,data:data['value']});
              }else{
                actions.setValue({setting:setting,data:data});
              }
            }
          });
        } 
    }),
    saveSettingsToStorage:action((state, payload)=>{
      state[payload.setting].value = payload.value;
      var Obj = {};
      settingsToSave.map(async (setting) => {
          Obj[setting]={}
          Object.keys(state[setting]).forEach(key => {
            console.log(key);
            Obj[setting][key] = state[setting][key];
          });
      });
      const string = JSON.stringify(Obj)
      storageSave(settingsKey,string);
    }),
    deleteSettingsFromStorage:action((actions, payload)=>{
      storageDelete(settingsKey);
    }),
    makeStateAccessible:action(async (state, payload)=>{
      AccessibleState = state;
    }),
 
    setSettingBeingChanged:action((state, payload)=>{
      state.settingBeingChanged = payload;
    }),
    toggleChangeSettingModal:action((state, payload) => {
        // if(state.isChangingSetting==false){
        //     state.isChangingSetting=true;
        // }
        if(state.isChangingSetting==false){
            state.isChangingSetting=true;
        }else{
            state.isChangingSetting=false;
        }
    }),
    openChangeSettingModal:action((state, payload) => {
      state.isChangingSetting = true;
    }),
    closeChangeSettingModal:action((state, payload) => {
      state.isChangingSetting = false;
    }),

    //MODAL
    modalIsOpen:false,
    modalTitle:'Modal Title',
    modalSetting:'DefaultSetting',
    modalSettingValue:0,
    modalOptions:[
        {title:'DefaultTitle',details:'DefaultDetails',value:'DefaultValue'},

    ],
    modal_changeTitle:action((state, payload)=>{
        if(payload.title!=null){
            state.modalTitle = payload.title;
        }else{
            debug('ERROR: Not enough params');
        }
    }),
    modal_changeOptions:action((state, payload)=>{
        if(payload.options!=null){
            state.modalOptions = payload.options;
        }else{
            debug('ERROR: Not enough params');
        }
    }),
    modal_changeSetting:action((state, payload)=>{
        if(payload.setting!=null){
            state.modalSetting = payload.setting;
        }else{
            debug('ERROR: Not enough params');
        }
    }),
    modal_changeSettingValue_internal:action((state, payload)=>{
        if(payload.settingValue!=null){
            state.modalSettingValue = payload.settingValue;
        }else{
            debug('ERROR: Not enough params');
        }
    }),
    modal_changeSettingValue:thunk((actions, payload)=>{
        if(payload.settingValue!=null){
            const settingValue = payload.settingValue;
            actions.modal_changeSettingValue_internal({settingValue})
            // state.modalSettingValue = payload.settingValue;
        }else{
            debug('ERROR: Not enough params');
        }
    }),
    modal_open_internal:action((state, payload) => {
        debug(`SUCCESS: Open Modal of Title`);
        state.modalIsOpen = true;
    }),
    
    modal_open:thunk(async(actions, payload) => {
        if(payload.title!=null){
            // debug(`SUCCESS: Open Modal of Title:${payload.title}`);
            const title = payload.title;
            const options = payload.options;
            const setting = payload.setting;
            // var settingValue = await actions.store_getState({state:setting});
            // console.log(`title:${title}`)
            actions.modal_changeTitle({title});
            actions.modal_changeOptions({options});
            actions.modal_changeSetting({setting});
            actions.modal_settingValueLoad();
            actions.modal_open_internal();
        }else{
            debug('ERROR: Not enough params');
        }
    }),
    modal_close_internal:action((state, payload) => {
        debug(`SUCCESS: Close Modal of Title`);
        const modalSetting = state.modalSetting;
        const modalSettingValue = state.modalSettingValue;
        state[modalSetting] = {
            value:modalSettingValue,
        },
        state.modalIsOpen = false;
    }),
    modal_close:thunk((actions, payload) => {
        actions.modal_close_internal();
        actions.modal_clean();
    }),
    modal_clean:action((state, payload)=>{
        state.modalTitle = '';
        state.modalOptions = [];
        state.modalSetting = 'default';
        state.modalSettingValue = 'default';
    }),
    modal_settingValueLoad:action((state, payload)=>{
        const setting = state.modalSetting;
        state.modalSettingValue = state[setting].value;
    }),
    store_returnValue:'',
    store_returnValue_set:action((state, payload)=>{
        if(payload.state!=null && payload.value!=null){
            state[payload.state] = payload.value;
            // console.log(`payload:${payload.state}`);
            // return 
            // const _state = state[payload.state];
            // console.log(`value:${_state}`);
        }else{
            debug('ERROR: Not enough params');
        }
    }),
    store_getState:thunk((state, payload)=>{

        return 1;

    }),

    
    //SENDERS
    senders:[
        {
            id:0,
            name:'Sender Man',
            country:'China',
            pronvince:'Sichuan',
            city:'Chengdu',
            postalCode:'121212',
            address:'HiTech Zone',
            countryCode:'86',
            phoneNumber:'1234567890',
        },
        {
            id:1,
            name:'Sender Man 1',
            country:'China',
            pronvince:'Tianjin',
            city:'Tianjin',
            postalCode:'121212',
            address:'8833 Heather Dr. Santa Clara, CA 95050',
            countryCode:'86',
            phoneNumber:'0987654321',
        },
        {
            id:2,
            name:'Sender Man 2',
            country:'China',
            pronvince:'Nanjing',
            city:'Nanjing',
            postalCode:'121212',
            address:'9247 West Halifax Drive Liverpool, NY 13090',
            countryCode:'86',
            phoneNumber:'0987654321',
        },
    ],
    senders_add:action((state, payload) => {}),
    sender_selected:{
        value:1,
        type:'index',
    },

    //RECEIVERS
    receivers:[
        {
            id:0,
            name:'Receiver Man',
            country:'Malawi',
            pronvince:'',
            city:'Lilongwe',
            postalCode:'121212',
            address:'Ntauni',
            countryCode:'265',
            phoneNumber:'1234567890',
        },
    ],
    receivers_add:action((state, payload) => {}),
    receiver_selected:{
        value:0,
        type:'index',
    },



    //SHIPPING
    shippingAddresses:[
        {
            id:0,
            name:'Main Shipping WareHouse',
            country:'China',
            province:'GuangDong',
            city:'GuangZhou',
            postalCode:'',

        }
    ],

    //ORDERS
    orderNew:
        {
            title:'New Shipment',
            value:{
                senderId:'',
                receiverId:'',
                expressNumbers:[],
                shippingWareHourse:'',
            },
            type:'options',
            options:['OUT','IN'],
            description:'this is the direction you are going',
        },
    orders:[
        {
            senderId:'',
            receiverId:'',
            expressNumbers:[],
            shippingWareHourse:'',
        }
    ],
});

export default settingsStore;