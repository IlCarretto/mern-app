import express from 'express';
import {login} from '../controllers/auth.js';

const router = express.Router(); // identify these routes will all be configured -> ("/auth", authRoutes) === ("/login", login)

router.post("/login", login);

export default router