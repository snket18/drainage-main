"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sensor_controller_1 = require("../controllers/sensor.controller");
const router = (0, express_1.Router)();
router.get('/', sensor_controller_1.getSensors);
router.get('/:id', sensor_controller_1.getSensorById);
router.put('/:id', sensor_controller_1.updateSensor);
exports.default = router;
