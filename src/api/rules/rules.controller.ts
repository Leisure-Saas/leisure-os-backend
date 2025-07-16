import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createRule = async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;
        const data = req.body;
        
        const newRule = await prisma.pricingRule.create({
            data: {
                ...data,
                start_date: new Date(data.start_date),
                end_date: new Date(data.end_date),
                propertyId: parseInt(propertyId),
            },
        });
        res.status(201).json(newRule);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllRules = async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;
        const rules = await prisma.pricingRule.findMany({
            where: { propertyId: parseInt(propertyId) },
        });
        res.status(200).json(rules);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
