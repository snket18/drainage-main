"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSensor = exports.getSensorById = exports.getSensors = void 0;
const prisma_1 = require("../prisma");
const getSensors = async (req, res) => {
    try {
        const sensors = await prisma_1.prisma.sensor.findMany();
        res.json(sensors);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch sensors' });
    }
};
exports.getSensors = getSensors;
const getSensorById = async (req, res) => {
    try {
        const sensor = await prisma_1.prisma.sensor.findUnique({
            where: { id: req.params.id },
        });
        if (sensor) {
            res.json(sensor);
        }
        else {
            res.status(404).json({ error: 'Sensor not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch sensor' });
    }
};
exports.getSensorById = getSensorById;
const updateSensor = async (req, res) => {
    try {
        const updatedSensor = await prisma_1.prisma.sensor.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(updatedSensor);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update sensor' });
    }
};
exports.updateSensor = updateSensor;
