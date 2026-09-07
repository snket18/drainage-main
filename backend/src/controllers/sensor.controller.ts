import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getSensors = async (req: Request, res: Response) => {
  try {
    const sensors = await prisma.sensor.findMany();
    res.json(sensors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sensors' });
  }
};

export const getSensorById = async (req: Request, res: Response) => {
  try {
    const sensor = await prisma.sensor.findUnique({
      where: { id: req.params.id as string },
    });
    if (sensor) {
      res.json(sensor);
    } else {
      res.status(404).json({ error: 'Sensor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sensor' });
  }
};

export const updateSensor = async (req: Request, res: Response) => {
  try {
    const updatedSensor = await prisma.sensor.update({
      where: { id: req.params.id as string },
      data: req.body,
    });
    res.json(updatedSensor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update sensor' });
  }
};
