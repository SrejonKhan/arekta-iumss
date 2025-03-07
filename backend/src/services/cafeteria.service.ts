import { PrismaClient } from '@prisma/client';
import {
    CreateCafeteriaInput,
    UpdateCafeteriaInput,
    CreateMenuInput,
    UpdateMenuInput,
    CreateFoodInput,
    UpdateFoodInput,
} from '../schemas/cafeteria.schema';

const prisma = new PrismaClient();

// Cafeteria Services
export async function createCafeteria(input: CreateCafeteriaInput) {
    return prisma.cafeteria.create({
        data: input,
        include: {
            CafeteriaMenu: {
                include: {
                    foods: true,
                },
            },
        },
    });
}

export async function getAllCafeterias() {
    return prisma.cafeteria.findMany({
        include: {
            CafeteriaMenu: {
                include: {
                    foods: true,
                },
            },
        },
    });
}

export async function getCafeteriaById(id: string) {
    return prisma.cafeteria.findUnique({
        where: { id },
        include: {
            CafeteriaMenu: {
                include: {
                    foods: true,
                },
            },
        },
    });
}

export async function updateCafeteria(id: string, input: UpdateCafeteriaInput) {
    return prisma.cafeteria.update({
        where: { id },
        data: input,
        include: {
            CafeteriaMenu: {
                include: {
                    foods: true,
                },
            },
        },
    });
}

export async function deleteCafeteria(id: string) {
    return prisma.cafeteria.delete({
        where: { id },
    });
}

// Menu Services
export async function createMenu(cafeteriaId: string, input: CreateMenuInput) {
    return prisma.cafeteriaMenu.create({
        data: {
            ...input,
            Cafeteria: {
                connect: { id: cafeteriaId },
            },
        },
        include: {
            foods: true,
        },
    });
}

export async function getMenuById(menuId: string) {
    return prisma.cafeteriaMenu.findUnique({
        where: { id: menuId },
        include: {
            foods: true,
        },
    });
}

export async function updateMenu(menuId: string, input: UpdateMenuInput) {
    return prisma.cafeteriaMenu.update({
        where: { id: menuId },
        data: input,
        include: {
            foods: true,
        },
    });
}

export async function deleteMenu(menuId: string) {
    return prisma.cafeteriaMenu.delete({
        where: { id: menuId },
    });
}

// Food Services
export async function createFood(menuId: string, input: CreateFoodInput) {
    return prisma.food.create({
        data: {
            ...input,
            CafeteriaMenu: {
                connect: { id: menuId },
            },
        },
    });
}

export async function getFoodById(foodId: string) {
    return prisma.food.findUnique({
        where: { id: foodId },
    });
}

export async function updateFood(foodId: string, input: UpdateFoodInput) {
    return prisma.food.update({
        where: { id: foodId },
        data: input,
    });
}

export async function deleteFood(foodId: string) {
    return prisma.food.delete({
        where: { id: foodId },
    });
}

// Additional Query Services
export async function getFoodsByType(type: string) {
    return prisma.food.findMany({
        where: { foodType: type },
    });
}

export async function getFoodsByCategory(category: string) {
    return prisma.food.findMany({
        where: { foodCategory: category },
    });
} 