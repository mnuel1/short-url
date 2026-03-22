import Cookies from "js-cookie";


export const postAccessKey = (accessToken: any, expires: any) => {
  Cookies.set("accessToken", accessToken, { expires });
}
export const getAccessKey = () => {
  return Cookies.get("accessToken");
}
export const removeAccessKey = () => {
  Cookies.remove("accessToken");
}