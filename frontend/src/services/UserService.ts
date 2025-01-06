import axiosInstance from "../auth/axiosInstance";
import { User } from "../models/User";

export const UserService = {
  url: "http://localhost:8080/api/users",

  getUser: async (user: number) => {
    return await axiosInstance.get<User>(`${UserService.url}/${user}`);
  },
};