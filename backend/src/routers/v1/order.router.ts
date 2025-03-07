import { Router } from 'express';
import {
    createOrderHandler,
    updateOrderStatusHandler,
    getOrderByIdHandler,
    getUserOrdersHandler,
    getAllOrdersHandler,
} from '../../controllers/order.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import {
    createOrderSchema,
    updateOrderStatusSchema,
    getOrdersSchema,
} from '../../schemas/order.schema';
import { hasRole } from '../../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public routes (requires authentication)
router.post('/', validateRequest(createOrderSchema), createOrderHandler);
router.get('/my-orders', getUserOrdersHandler);
router.get('/:orderId', getOrderByIdHandler);

// Protected routes - Staff and Admin only
router.use(hasRole([Role.CAFETERIA_STAFF, Role.ADMIN]));
router.get('/', validateRequest(getOrdersSchema), getAllOrdersHandler);
router.patch('/:orderId/status', validateRequest(updateOrderStatusSchema), updateOrderStatusHandler);

export default router; 