// ==============================================================================
// features/leave-management/domain/enums/leave.enums.ts
// Leave management domain enums and types
// ==============================================================================

export type LeaveUnit = "day" | "hour";

export type LeaveRequestStatus = "pending" | "approved" | "rejected" | "cancelled";

export type LeaveReviewDecision = "approved" | "rejected";
