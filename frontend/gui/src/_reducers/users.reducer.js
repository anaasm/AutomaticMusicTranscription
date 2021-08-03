import { userConstants } from '../_constants';

let pdf = null;
//let blob = localStorage.getItem('blob');
const initialState = pdf ? { availableUrl: true, pdf } : {};

export function users(state = initialState, action) {
  switch (action.type) {
    case userConstants.SUBMIT_REQUEST:
      return {
          loading:true,
          availableUrl: false
      }
    case userConstants.SUBMIT_SUCCESS:
      return{
         availableUrl: true,
         pdf: action.pdf
      }
    case userConstants.SUBMIT_FAILURE:
      return {

      }
    // case userConstants.DOWNLOAD_REQUEST:
    //   return {
    //     loading: true
    //   }
    // case userConstants.DOWNLOAD_SUCCESS:
    //   return {
    //     pdf: null,
    //     availableUrl: false,
    //     //blob:null
    //   }
    // case userConstants.DOWNLOAD_FAILURE:
    //     return {
    //     }
    default:
      return state
  }
}