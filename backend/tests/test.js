import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 500,           // 50 Virtual Users
  duration: '30s',   // Durasi 30 detik
};

export default function () {
    http.get('http://localhost:8080/api/v1/skills');
    sleep(1);
}