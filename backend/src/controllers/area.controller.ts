import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getAreas = async (req: Request, res: Response) => {
  try {
    const areas = await prisma.area.findMany();
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch areas' });
  }
};

export const getAreaById = async (req: Request, res: Response) => {
  try {
    const area = await prisma.area.findUnique({
      where: { id: req.params.id },
    });
    if (area) {
      res.json(area);
    } else {
      res.status(404).json({ error: 'Area not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch area' });
  }
};

export const updateArea = async (req: Request, res: Response) => {
  try {
    const updatedArea = await prisma.area.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updatedArea);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update area' });
  }
};
