import { PrismaClient, OrderType, OrderStatus } from '@prisma/client';
import { CreateOrderInput, UpdateOrderStatusInput } from '../schemas/order.schema';

const prisma = new PrismaClient();

export async function createOrder(input: CreateOrderInput) {
    const { userId, orderType, orderItems } = input;

    // Calculate total amount and prepare order items
    let totalAmount = 0;
    const orderItemsWithPrice = await Promise.all(
        orderItems.map(async (item) => {
            const food = await prisma.food.findUnique({
                where: { id: item.foodId },
            });
            if (!food) {
                throw new Error(`Food with id ${item.foodId} not found`);
            }
            totalAmount += food.foodPrice * item.quantity;
            return {
                ...item,
                price: food.foodPrice,
            };
        })
    );

    // Create order with items
    return prisma.foodOrder.create({
        data: {
            orderType,
            totalAmount,
            userId,
            orderItems: {
                create: orderItemsWithPrice.map((item) => ({
                    quantity: item.quantity,
                    price: item.price,
                    food: {
                        connect: { id: item.foodId },
                    },
                })),
            },
        },
        include: {
            orderItems: {
                include: {
                    food: true,
                },
            },
            user: {
                select: {
                    id: true,
                    username: true,
                    displayName: true,
                },
            },
        },
    });
}

export async function updateOrderStatus(orderId: string, input: UpdateOrderStatusInput) {
    const { status } = input;
    return prisma.foodOrder.update({
        where: { id: orderId },
        data: { status },
        include: {
            orderItems: {
                include: {
                    food: true,
                },
            },
            user: {
                select: {
                    id: true,
                    username: true,
                    displayName: true,
                },
            },
        },
    });
}

export async function getOrderById(orderId: string) {
    return prisma.foodOrder.findUnique({
        where: { id: orderId },
        include: {
            orderItems: {
                include: {
                    food: true,
                },
            },
            user: {
                select: {
                    id: true,
                    username: true,
                    displayName: true,
                },
            },
        },
    });
}

export async function getUserOrders(userId: string) {
    return prisma.foodOrder.findMany({
        where: { userId },
        include: {
            orderItems: {
                include: {
                    food: true,
                },
            },
            user: {
                select: {
                    id: true,
                    username: true,
                    displayName: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

export async function getAllOrders(filters?: {
    orderType?: OrderType;
    status?: OrderStatus;
}) {
    return prisma.foodOrder.findMany({
        where: filters,
        include: {
            orderItems: {
                include: {
                    food: true,
                },
            },
            user: {
                select: {
                    id: true,
                    username: true,
                    displayName: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
} 