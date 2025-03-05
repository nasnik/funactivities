import express from "express";
import {
    getAllActivities,
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivitiesForHomepage,
    getActivitiesByProvider,
} from "../controllers/activities";
import upload from "../middleware/upload";

const router = express.Router();

// Fetch all activities (for homepage)
router.get("/all", getActivitiesForHomepage);

// Fetch activities for a specific provider
router.get("/provider/:providerId", getActivitiesByProvider);

// Standard CRUD operations for individual users/providers
router.route("/")
    .post(upload.single("image"), createActivity)
    .get(getAllActivities);

router.route("/:id")
    .get(getActivity)
    .delete(deleteActivity)
    .patch(upload.single("image"), updateActivity);

export default router;
