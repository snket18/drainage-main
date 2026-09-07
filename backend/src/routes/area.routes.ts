import { Router } from 'express';
import { getAreas, getAreaById, updateArea } from '../controllers/area.controller';

const router = Router();

router.get('/', getAreas);
router.get('/:id', getAreaById);
router.put('/:id', updateArea);

export default router;
