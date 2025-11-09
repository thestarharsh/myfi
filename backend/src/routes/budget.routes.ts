import { Router } from 'express';
import {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budget.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getBudgets);
router.get('/:id', getBudget);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;


