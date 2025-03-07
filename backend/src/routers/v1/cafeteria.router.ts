import { Router } from 'express';
import {
    createCafeteriaHandler,
    getAllCafeteriasHandler,
    getCafeteriaByIdHandler,
    updateCafeteriaHandler,
    deleteCafeteriaHandler,
    createMenuHandler,
    getMenuByIdHandler,
    updateMenuHandler,
    deleteMenuHandler,
    createFoodHandler,
    getFoodByIdHandler,
    updateFoodHandler,
    deleteFoodHandler,
    getFoodsByTypeHandler,
    getFoodsByCategoryHandler,
} from '../../controllers/cafeteria.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import {
    createCafeteriaSchema,
    updateCafeteriaSchema,
    createMenuSchema,
    updateMenuSchema,
    createFoodSchema,
    updateFoodSchema,
} from '../../schemas/cafeteria.schema';
import { hasRole } from '../../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public routes
router.get('/', getAllCafeteriasHandler);
router.get('/:id', getCafeteriaByIdHandler);
router.get('/menu/:menuId', getMenuByIdHandler);
router.get('/food/:foodId', getFoodByIdHandler);
router.get('/foods/type/:type', getFoodsByTypeHandler);
router.get('/foods/category/:category', getFoodsByCategoryHandler);

// Protected routes - Cafeteria staff only
router.use(hasRole([Role.CAFETERIA, Role.ADMIN]));

// Cafeteria management
router.post('/', validateRequest(createCafeteriaSchema), createCafeteriaHandler);
router.patch('/:id', validateRequest(updateCafeteriaSchema), updateCafeteriaHandler);
router.delete('/:id', deleteCafeteriaHandler);

// Menu management
router.post('/:cafeteriaId/menu', validateRequest(createMenuSchema), createMenuHandler);
router.patch('/:cafeteriaId/menu/:menuId', validateRequest(updateMenuSchema), updateMenuHandler);
router.delete('/:cafeteriaId/menu/:menuId', deleteMenuHandler);

// Food management
router.post('/menu/:menuId/food', validateRequest(createFoodSchema), createFoodHandler);
router.patch('/menu/:menuId/food/:foodId', validateRequest(updateFoodSchema), updateFoodHandler);
router.delete('/menu/:menuId/food/:foodId', deleteFoodHandler);

export default router; 