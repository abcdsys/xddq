import GameNetMgr from "#game/net/GameNetMgr.js";
import Protocol from "#game/net/Protocol.js";
import logger from "#utils/logger.js";
import SystemUnlockMgr from "#game/mgr/SystemUnlockMgr.js";
import LoopMgr from "#game/common/LoopMgr.js";

export default class CustomMgr {
    constructor() {
        this.CUSTOM_INTERVAL = 1000 * 60 * 10; // 每次间隔时间(10分钟)
        this.lastExecuteTime = 0;
        this.initialized = false;

        this.isProcessing = false;
    }

    static get inst() {
        if (!this._instance) {
            this._instance = new CustomMgr();
        }
        return this._instance;
    }

    reset() {
        this._instance = null;
    }

    clear() {
        LoopMgr.inst.remove(this);
    }

    init() {
        if (this.initialized) {
            return;
        }
        logger.info("[自定义管理] 已初始化");

        // 检查是否有分身 登天后才有的
        if (SystemUnlockMgr.SOARING) {
            GameNetMgr.inst.sendPbMsg(Protocol.S_ATTRIBUTE_GET_SEPARATION_DATAA_MSG_LIST_REQ, {});
        }
        this.initialized = true;
    }

    async customLoop() {
        const now = Date.now();
        if (now - this.lastExecuteTime >= this.CUSTOM_INTERVAL) {
            this.lastExecuteTime = now;

            if (SystemUnlockMgr.PALACE) {
                // 仙宫外部数据请求
                GameNetMgr.inst.sendPbMsg(Protocol.S_PALACE_ENTER_OUTER, {});
            }

            // 道友一键赠送和领取
            GameNetMgr.inst.sendPbMsg(Protocol.S_FRIEND_ONE_KEY, { type: 1 });
            GameNetMgr.inst.sendPbMsg(Protocol.S_FRIEND_ONE_KEY, { type: 2 });

            // 运势
            GameNetMgr.inst.sendPbMsg(Protocol.S_ACTIVITY_SHARE, { activityId: 0, conditionId: 0 });
            GameNetMgr.inst.sendPbMsg(Protocol.S_ACTIVITY_BBS, { activityId: 0, conditionId: 0 });
            GameNetMgr.inst.sendPbMsg(Protocol.S_ACTIVITY_GAME_CIRCLE, { activityId: 0, conditionId: 0 });

            // for (let i = 0; i < 30; i++) {
            //     GameNetMgr.inst.sendPbMsg(Protocol.S_ACTIVITY_LUCKY_DRAW, { activityId: 250100, times: 1 }); // 运势抽奖
            //     GameNetMgr.inst.sendPbMsg(Protocol.S_ACTIVITY_LUCKY_DRAW, { activityId: 250101, times: 1 }); // 运势抽奖
            //     GameNetMgr.inst.sendPbMsg(Protocol.S_ACTIVITY_LUCKY_DRAW, { activityId: 250102, times: 1 }); // 运势抽奖
            //     GameNetMgr.inst.sendPbMsg(Protocol.S_ACTIVITY_LUCKY_DRAW, { activityId: 250103, times: 1 }); // 运势抽奖
            // }

            // 宝华堂
            GameNetMgr.inst.sendPbMsg(Protocol.S_ACTIVITY_BUY_MALL_GOODS, { activityId: 9875533, mallId: 400000003, count: 1 });
            await new Promise(resolve => setTimeout(resolve, 2000));
            // 累充-免费礼包
            GameNetMgr.inst.sendPbMsg(Protocol.S_ACTIVITY_BUY_MALL_GOODS, { activityId: 10129151, mallId: 400000007, count: 1 });
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 自选礼包-免费礼包
            GameNetMgr.inst.sendPbMsg(Protocol.S_ACTIVITY_BUY_MALL_GOODS, { activityId: 9788786, mallId: 400000003, count: 1 });
            await new Promise(resolve => setTimeout(resolve, 2000));
            // 超值礼包-免费礼包
            GameNetMgr.inst.sendPbMsg(Protocol.S_ACTIVITY_BUY_MALL_GOODS, { activityId: 9788790, mallId: 400000003, count: 1 });
            await new Promise(resolve => setTimeout(resolve, 2000));

             // 仙缘-免费礼包
             GameNetMgr.inst.sendPbMsg(Protocol.S_ACTIVITY_BUY_MALL_GOODS, { activityId: 9788734, mallId: 400000001, count: 1 });
             await new Promise(resolve => setTimeout(resolve, 2000));
            // 仙缘-福泽签到
            for (let i = 0; i < 8; i++) {
                const conditionId = 10000 + i;
                GameNetMgr.inst.sendPbMsg(Protocol.S_GOOD_FORTUNE_GET_REWARD_REQ, { activityId: 9788710, conditionId: conditionId, type: 1 });
            }
            // 疯狂聚宝盆签到
            for (let i = 1; i < 8; i++) {
                const conditionId = 10000 + i;
                GameNetMgr.inst.sendPbMsg(Protocol.S_TREASURE_BOWL_SIGN, { activityId: 9788708, conditionId: conditionId, getType: 0 });
            }

            // 福地自动收获
            const homelandGetReward = global.account.switch.homelandGetReward || false;
            if (homelandGetReward) {
                GameNetMgr.inst.sendPbMsg(Protocol.S_HOMELAND_GET_REWARD, {});
            }
        }
    }

    async loopUpdate() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            this.customLoop();
        } catch (error) {
            logger.error(`[自定义管理] loopUpdate error: ${error}`);
        } finally {
            this.isProcessing = false;
        }
    }
}
