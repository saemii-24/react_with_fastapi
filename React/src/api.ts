import axios from "axios";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:8000", // 기본 URL 설정
});

// 인스턴스를 export하여 다른 파일에서 사용할 수 있도록 함
export default api;
