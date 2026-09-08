"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const area_controller_1 = require("../controllers/area.controller");
const router = (0, express_1.Router)();
router.get('/', area_controller_1.getAreas);
router.get('/:id', area_controller_1.getAreaById);
router.put('/:id', area_controller_1.updateArea);
exports.default = router;
