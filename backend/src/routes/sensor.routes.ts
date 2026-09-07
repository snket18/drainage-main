import { Router } from 'express';
import { getSensors, getSensorById, updateSensor } from '../controllers/sensor.controller';

const router = Router();

router.get('/', getSensors);
router.get('/:id', getSensorById);
router.put('/:id', updateSensor);

export default router;
