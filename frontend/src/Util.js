import moment from "moment";

const BACKEND_ROOT_URL = "http://localhost:8001"
export const convertIntoDays = (date) => {
    if (!date) return "Invalid date";
  
    const daysAgo = moment(date).fromNow(true); // true removes "ago" from output
    return `${daysAgo} ago`;
};

export function getBackendRootUrl(){
   return BACKEND_ROOT_URL;
}