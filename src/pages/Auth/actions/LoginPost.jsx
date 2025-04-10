import axiosInstance from "../../../API/axiosInstance";
import {
  decryptAES,
  encryptAES,
} from "../../../redux/middleware/encryptPayloadUtils";
import { openNotification } from "../utils/Notification";
import { validateInput } from "../utils/validateFunction";
import { signInFailure, signInSuccess } from "../../../redux/slices/authSlice";
import { userSignInSuccess } from "../../../redux/slices/userSlice";
import { navigateByRole } from "../utils/roleNavigate";
import { setPlantData } from "../../../redux/slices/plantSlice";
import { set } from "lodash";

export const loginPost = async (
  loginPayload,
  setError,
  setLoading,
  dispatch,
  saveUserLocal,
  navigate
) => {
  setError({ UserError: "", PasswordError: "" });
  setLoading(true);
  let hasError = false;
  if (!loginPayload.email_or_phone) {
    setError((prev) => ({
      ...prev,
      UserError: "*Email / Mobile Number is required",
    }));
    hasError = true;
  } else if (!validateInput(loginPayload.email_or_phone)) {
    setError((prev) => ({
      ...prev,
      UserError: "*Please enter a valid Email or Mobile Number",
    }));
    hasError = true;
  }

  if (!loginPayload.password) {
    setError((prev) => ({ ...prev, PasswordError: "*Password is required" }));
    hasError = true;
  }

  if (hasError) {
    setLoading(false);
    return;
  }
  try {
    const encryTedData = await encryptAES(JSON.stringify(loginPayload));

    const res = await axiosInstance.post("/login/", { data: encryTedData });

    const decrypt = await decryptAES(res.data.response);
    console.log("decrypt", JSON.parse(decrypt));
    const {
      access_token,
      refresh_token,
      user_id,
      is_superuser,
      first_name,
      last_name,
      user_name,
      message,
      role_id,
      location_id,
      plant_name,
      plant_id,
      role_name,
      permissions,
    } = JSON.parse(decrypt);

    dispatch(
      signInSuccess({
        accessToken: access_token,
        refreshToken: refresh_token,
      })
    );
    if (saveUserLocal) {
      localStorage.setItem("rememberMeClicked", saveUserLocal); // Set local Remember Me state
    }

    if (role_name === "User") {
   
      dispatch(setPlantData({
        id: plant_id,
        plant_name: plant_name,
        is_active: true,
      }));
    }
    dispatch(
      userSignInSuccess({
        userId: user_id,
        userName: user_name,
        firstName: first_name,
        lastName: last_name,
        isSuperUser: is_superuser,
        user_role_name: role_name,
        roleId: role_id,
        locationId: location_id,
        permissions: permissions,
        roleName: role_name,
      })
    );
    
    openNotification("success", message);

   navigateByRole(role_name, navigate);

  } catch (error) {
    dispatch(signInFailure(error.response?.data));
    openNotification(
      "error",
      error.response?.data?.detail || "Invalid Credentials"
    );
  } finally {
    setLoading(false);
  }
};
