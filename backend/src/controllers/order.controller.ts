import { Request, Response } from 'express';
import * as orderService from '../services/order.service';
import { OrderType, OrderStatus } from '@prisma/client';

export async function createOrderHandler(req: Request, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const order = await orderService.createOrder({
            userId: req.user.id,
            orderType: req.body.orderType,
            orderItems: req.body.orderItems,
        });

        return res.status(201).json(order);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
    }
}

export async function updateOrderStatusHandler(req: Request, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const order = await orderService.updateOrderStatus(
            req.params.orderId,
            { status: req.body.status }
        );

        return res.status(200).json(order);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(500).json({ message: error.message });
    }
}

export async function getOrderByIdHandler(req: Request, res: Response) {
    try {
        const order = await orderService.getOrderById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).json(order);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getUserOrdersHandler(req: Request, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const orders = await orderService.getUserOrders(req.user.id);
        return res.status(200).json(orders);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getAllOrdersHandler(req: Request, res: Response) {
    try {
        const filters: {
            orderType?: OrderType;
            status?: OrderStatus;
        } = {};

        if (req.query.orderType) {
            filters.orderType = req.query.orderType as OrderType;
        }

        if (req.query.status) {
            filters.status = req.query.status as OrderStatus;
        }

        const orders = await orderService.getAllOrders(filters);
        return res.status(200).json(orders);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
} 