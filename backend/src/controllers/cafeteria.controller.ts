import { Request, Response } from 'express';
import * as cafeteriaService from '../services/cafeteria.service';

// Cafeteria Controllers
export async function createCafeteriaHandler(req: Request, res: Response) {
    try {
        const cafeteria = await cafeteriaService.createCafeteria(req.body);
        return res.status(201).json(cafeteria);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getAllCafeteriasHandler(req: Request, res: Response) {
    try {
        const cafeterias = await cafeteriaService.getAllCafeterias();
        return res.status(200).json(cafeterias);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getCafeteriaByIdHandler(req: Request, res: Response) {
    try {
        const cafeteria = await cafeteriaService.getCafeteriaById(req.params.id);
        if (!cafeteria) {
            return res.status(404).json({ message: 'Cafeteria not found' });
        }
        return res.status(200).json(cafeteria);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export async function updateCafeteriaHandler(req: Request, res: Response) {
    try {
        const cafeteria = await cafeteriaService.updateCafeteria(req.params.id, req.body);
        return res.status(200).json(cafeteria);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Cafeteria not found' });
        }
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteCafeteriaHandler(req: Request, res: Response) {
    try {
        await cafeteriaService.deleteCafeteria(req.params.id);
        return res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Cafeteria not found' });
        }
        return res.status(500).json({ message: error.message });
    }
}

// Menu Controllers
export async function createMenuHandler(req: Request, res: Response) {
    try {
        const menu = await cafeteriaService.createMenu(req.params.cafeteriaId, req.body);
        return res.status(201).json(menu);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Cafeteria not found' });
        }
        return res.status(500).json({ message: error.message });
    }
}

export async function getMenuByIdHandler(req: Request, res: Response) {
    try {
        const menu = await cafeteriaService.getMenuById(req.params.menuId);
        if (!menu) {
            return res.status(404).json({ message: 'Menu not found' });
        }
        return res.status(200).json(menu);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export async function updateMenuHandler(req: Request, res: Response) {
    try {
        const menu = await cafeteriaService.updateMenu(req.params.menuId, req.body);
        return res.status(200).json(menu);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Menu not found' });
        }
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteMenuHandler(req: Request, res: Response) {
    try {
        await cafeteriaService.deleteMenu(req.params.menuId);
        return res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Menu not found' });
        }
        return res.status(500).json({ message: error.message });
    }
}

// Food Controllers
export async function createFoodHandler(req: Request, res: Response) {
    try {
        const food = await cafeteriaService.createFood(req.params.menuId, req.body);
        return res.status(201).json(food);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Menu not found' });
        }
        return res.status(500).json({ message: error.message });
    }
}

export async function getFoodByIdHandler(req: Request, res: Response) {
    try {
        const food = await cafeteriaService.getFoodById(req.params.foodId);
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }
        return res.status(200).json(food);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export async function updateFoodHandler(req: Request, res: Response) {
    try {
        const food = await cafeteriaService.updateFood(req.params.foodId, req.body);
        return res.status(200).json(food);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Food not found' });
        }
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteFoodHandler(req: Request, res: Response) {
    try {
        await cafeteriaService.deleteFood(req.params.foodId);
        return res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Food not found' });
        }
        return res.status(500).json({ message: error.message });
    }
}

// Additional Query Controllers
export async function getFoodsByTypeHandler(req: Request, res: Response) {
    try {
        const foods = await cafeteriaService.getFoodsByType(req.params.type);
        return res.status(200).json(foods);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getFoodsByCategoryHandler(req: Request, res: Response) {
    try {
        const foods = await cafeteriaService.getFoodsByCategory(req.params.category);
        return res.status(200).json(foods);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
} 