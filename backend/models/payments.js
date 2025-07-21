import mongoose from "mongoose";

const Payment = mongoose.model(
    "Payment",
    new mongoose.Schema({
        from: String,
        txHash: String,
        amount: String,
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        confirmedAt: Date,
        forceApproved: Boolean,
        notified: { type: Boolean, default: false },
        method : {
            type: String,
            enum: ["crypto", "bank"],
            // required: true
        },
        // method: "crypto" | "bank",
        //   forceApproved: { type: Boolean, default: false }
        // Admin có thể đánh dấu giao dịch này là đã được phê duyệt forceApproved
    })
);
export default Payment;