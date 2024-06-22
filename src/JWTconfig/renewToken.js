import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:3000/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function renewToken() {
  try {
    // Ambil refresh token dari localStorage
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("Refresh token not found in localStorage");
    }

    // Kirim permintaan untuk memperbarui token
    const response = await axiosInstance.post(
      "/user/token/renew",
      {
        refresh_token: refreshToken,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Request URL:", response.config.url); // Logging URL permintaan
    console.log("Request Headers:", response.config.headers); // Logging headers permintaan
    console.log("Request Data:", response.config.data); // Logging data permintaan

    console.log("Response Status:", response.status); // Logging status respons
    console.log("Response Data:", response.data); // Logging data respons

    if (response.status === 200 && response.data.tokens.Access) {
      const access_token = response.data.tokens.Access;
      localStorage.setItem("accessToken", access_token);
      console.log("New Access Token:", access_token);
      return access_token;
    } else {
      throw new Error("Failed to renew token");
    }
  } catch (error) {
    console.error("Token renewal failed:", error);
    throw error;
  }
}
