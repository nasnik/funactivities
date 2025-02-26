import express from 'express';
import { getAllActivities, getActivity, createActivity, updateActivity, deleteActivity } from '../controllers/activities';

const router = express.Router();

router.route('/')
    .post(createActivity)
    .get(getAllActivities);

router.route('/:id')
    .get(getActivity)
    .delete(deleteActivity)
    .patch(updateActivity);

export default router;
