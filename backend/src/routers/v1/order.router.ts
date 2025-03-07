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

const router = Router();

// All routes (requires authentication)
router.post('/', validateRequest(createOrderSchema), createOrderHandler);
router.get('/my-orders', getUserOrdersHandler);
router.get('/:orderId', getOrderByIdHandler);
router.get('/', validateRequest(getOrdersSchema), getAllOrdersHandler);
router.patch('/:orderId/status', validateRequest(updateOrderStatusSchema), updateOrderStatusHandler);

export default router; 