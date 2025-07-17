import cron from 'node-cron';
import {Session, Kyc} from '../models/index.js'; 

export const startResetExpiredSessionsJob = () => {
  cron.schedule('* * * * *', async () => {
    console.log(`[CRON] Kiểm tra session hết hạn lúc ${new Date().toISOString()}`);
    const expiredTime = new Date(Date.now() - 1 * 60 * 1000); // 3 phút trước

    try {
      const expiredSessions = await Session.find({
        lastPingAt: { $lt: expiredTime }
      });
      console.log(`[CRON] Số session hết hạn: ${expiredSessions.length}`);
    //   console.log(`[DEBUG] expiredSessions:`, expiredSessions);

      for (const session of expiredSessions) {
        const kyc = await Kyc.findById(session.kycId);
        if (kyc && kyc.status === 'processing') {
            console.log(`[RESET] Chuẩn bị reset KYC ${kyc._id}`);
          kyc.status = 'pending';
          await kyc.save();
          console.log(`[RESET] KYC ${kyc._id} đặt lại 'pending' do session hết hạn`);
        }

        // await Session.deleteOne({ _id: session._id });
        // console.log(`[DELETE] Xoá session ${session._id}`);
      }
    } catch (error) {
      console.error(`[ERROR] Cron reset session:`, error);
    }
  });
};
