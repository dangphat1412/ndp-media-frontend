import axios from "@services/axios";

class UserService {
  async getUserSuggestions() {
    const respone = await axios.get("/user/profile/user/suggestions");
    return respone;
  }

  async logoutUser() {
    const response = await axios.get("/signout");
    return response;
  }

  async checkCurrentUser() {
    const response = await axios.get("/currentuser");
    return response;
  }
}

export const userService = new UserService();
