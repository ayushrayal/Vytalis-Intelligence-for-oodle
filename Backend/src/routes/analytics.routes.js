import { Router } from 'express';
import {
  getDailyAnalytics,
  getOverview,
  getOrdersAnalytics,
  getCountriesAnalytics,
  getUsersAnalytics,
  getMetaOverview
} from '../controllers/analytics.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Apply authentication middleware to all analytics endpoints
router.use(authenticateToken);

router.get('/daily', getDailyAnalytics);
router.get('/overview', getOverview);
router.get('/orders', getOrdersAnalytics);
router.get('/countries', getCountriesAnalytics);
router.get('/users', getUsersAnalytics);
router.get("/meta/overview", getMetaOverview);
export default router;
