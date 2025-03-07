import { z } from 'zod';
import { OrderType, OrderStatus } from '@prisma/client';

const orderItemSchema = z.object({
    foodId: z.string(),
    quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
    body: z.object({
        orderType: z.nativeEnum(OrderType),
        orderItems: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
    }),
});

export const updateOrderStatusSchema = z.object({
    params: z.object({
        orderId: z.string(),
    }),
    body: z.object({
        status: z.nativeEnum(OrderStatus),
    }),
});

export const getOrdersSchema = z.object({
    query: z.object({
        orderType: z.nativeEnum(OrderType).optional(),
        status: z.nativeEnum(OrderStatus).optional(),
    }).optional(),
});

// Types for service layer
export type CreateOrderInput = {
    userId: string;
    orderType: OrderType;
    orderItems: {
        foodId: string;
        quantity: number;
    }[];
};

export type UpdateOrderStatusInput = {
    status: OrderStatus;
}; 