import { z } from 'zod';
import { FoodType, FoodCategory } from '@prisma/client';

// Cafeteria Schemas
export const createCafeteriaSchema = z.object({
    body: z.object({
        CafeteriaName: z.string().min(2, 'Cafeteria name must be at least 2 characters'),
        CafeteriaInfo: z.string().min(10, 'Cafeteria info must be at least 10 characters'),
    }),
});

export const updateCafeteriaSchema = z.object({
    params: z.object({
        id: z.string(),
    }),
    body: z.object({
        CafeteriaName: z.string().min(2, 'Cafeteria name must be at least 2 characters').optional(),
        CafeteriaInfo: z.string().min(10, 'Cafeteria info must be at least 10 characters').optional(),
    }),
});

// Menu Schemas
export const createMenuSchema = z.object({
    params: z.object({
        cafeteriaId: z.string(),
    }),
    body: z.object({
        menuName: z.string().min(2, 'Menu name must be at least 2 characters'),
    }),
});

export const updateMenuSchema = z.object({
    params: z.object({
        cafeteriaId: z.string(),
        menuId: z.string(),
    }),
    body: z.object({
        menuName: z.string().min(2, 'Menu name must be at least 2 characters').optional(),
    }),
});

// Food Schemas
export const createFoodSchema = z.object({
    params: z.object({
        menuId: z.string(),
    }),
    body: z.object({
        foodName: z.string().min(2, 'Food name must be at least 2 characters'),
        foodPrice: z.number().positive('Price must be positive'),
        foodType: z.nativeEnum(FoodType),
        foodCategory: z.nativeEnum(FoodCategory),
        calories: z.number().nonnegative().default(0),
        protein: z.number().nonnegative().default(0),
        fat: z.number().nonnegative().default(0),
        carbs: z.number().nonnegative().default(0),
    }),
});

export const updateFoodSchema = z.object({
    params: z.object({
        menuId: z.string(),
        foodId: z.string(),
    }),
    body: z.object({
        foodName: z.string().min(2, 'Food name must be at least 2 characters').optional(),
        foodPrice: z.number().positive('Price must be positive').optional(),
        foodType: z.nativeEnum(FoodType).optional(),
        foodCategory: z.nativeEnum(FoodCategory).optional(),
        calories: z.number().nonnegative().optional(),
        protein: z.number().nonnegative().optional(),
        fat: z.number().nonnegative().optional(),
        carbs: z.number().nonnegative().optional(),
    }),
});

// Types for service layer
export type CreateCafeteriaInput = z.infer<typeof createCafeteriaSchema>['body'];
export type UpdateCafeteriaInput = z.infer<typeof updateCafeteriaSchema>['body'];
export type CreateMenuInput = z.infer<typeof createMenuSchema>['body'];
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>['body'];
export type CreateFoodInput = z.infer<typeof createFoodSchema>['body'];
export type UpdateFoodInput = z.infer<typeof updateFoodSchema>['body']; 