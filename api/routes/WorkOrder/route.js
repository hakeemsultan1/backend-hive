import express from "express";
import { addWorkOrder, getWorkOrders, addManHour, getWorkOrderDetails, addCost, addPart, getCsv, inspectionUA, procedureLineUA, updateWorkOrder, printWorkOrder, emailWorkOrder, getWorkOrdersDashboard, getWorkOrdersOnDate, getDailyWorkOrders, rescheduleWorkOrder, printMultipleWorkOrders, getWorkOrdersByStatus, getWorkOrderbyTimeRange, getFilteredWorkOrders, getEarlyMaintananceData, addPlannedWorkOrderController, completeWorkOrder, cancelWorkOrder, startWorkOrder, endWorkOrder } from "../../controllers/Shared/workOrderController.js";
import { bearerAuth } from "../../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/addUnplannedWorkOrder", bearerAuth, addWorkOrder);
router.post("/save/:id", bearerAuth, updateWorkOrder);
router.get("/get", bearerAuth, getWorkOrders);
router.get("/getByStatus", bearerAuth, getWorkOrdersByStatus);
router.get("/getByTimeRange", bearerAuth, getWorkOrderbyTimeRange);
router.post("/getFilteredWorkOrders", bearerAuth, getFilteredWorkOrders);
router.get("/getEarlyMaintenanceData", bearerAuth, getEarlyMaintananceData);
router.post("/addPlannedWorkOrder", bearerAuth, addPlannedWorkOrderController);
router.post("/addManHours", bearerAuth, addManHour);
router.post("/addCostinWO", bearerAuth, addCost);
router.post("/addPart", bearerAuth, addPart);
router.post("/inspectionUA", bearerAuth, inspectionUA);
router.post("/procedureLineUA", bearerAuth, procedureLineUA);
router.get("/getWorkOrderDetails/:id", bearerAuth, getWorkOrderDetails);
router.get("/export", bearerAuth, getCsv);
router.get("/print/:id", bearerAuth, printWorkOrder);
router.get("/email/:id", bearerAuth, emailWorkOrder);
router.get("/complete/:id", bearerAuth, completeWorkOrder);
router.get("/cancel/:id", bearerAuth, cancelWorkOrder);
router.get("/workOrderDashboard", bearerAuth, getWorkOrdersDashboard);
router.get("/workOrdersOnDate", bearerAuth, getWorkOrdersOnDate);
router.get("/getDailyWorkOrders", bearerAuth, getDailyWorkOrders);
router.post("/reschedule", bearerAuth, rescheduleWorkOrder);
router.post("/printDailyWorkOrders", bearerAuth, printMultipleWorkOrders);
router.post("/startWorkOrder", bearerAuth, startWorkOrder);
router.post("/endWorkOrder", bearerAuth, endWorkOrder);

export default router;