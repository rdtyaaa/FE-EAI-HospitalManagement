// jwtUtils.js
import { jwtDecode } from "jwt-decode";

export function decodeToken(token) {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (error) {
    console.error("Token decoding failed:", error);
    throw new Error("Invalid token");
  }
}
