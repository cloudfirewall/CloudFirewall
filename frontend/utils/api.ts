import axios from 'axios';
import { userService } from '../services/user.service';

export default axios.create({
  baseURL: `http://localhost:8000/`,
});



