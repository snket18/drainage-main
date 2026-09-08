"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateArea = exports.getAreaById = exports.getAreas = void 0;
const prisma_1 = require("../prisma");
const getAreas = async (req, res) => {
    try {
        const areas = await prisma_1.prisma.area.findMany();
        res.json(areas);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch areas' });
    }
};
exports.getAreas = getAreas;
const getAreaById = async (req, res) => {
    try {
        const area = await prisma_1.prisma.area.findUnique({
            where: { id: req.params.id },
        });
        if (area) {
            res.json(area);
        }
        else {
            res.status(404).json({ error: 'Area not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch area' });
    }
};
exports.getAreaById = getAreaById;
const updateArea = async (req, res) => {
    try {
        const updatedArea = await prisma_1.prisma.area.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(updatedArea);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update area' });
    }
};
exports.updateArea = updateArea;
