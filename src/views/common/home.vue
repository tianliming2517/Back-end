<template>
    <div class="mod-home">
        <h3 v-show="!showData">欢迎使用ADS后台管理系统</h3>
        <el-row :gutter="24" v-show="showData">
            <el-col :span="6">
                <el-card shadow="hover" class="card">
                    <span class="title">平台总单量:</span>
                    <br />
                    <span class="number">{{data.platformOrderNum}}</span>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="card">
                    <span class="title">平台会员总数:</span>
                    <br />
                    <span class="number">{{data.platformUserNum}}</span>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="card">
                    <span class="title">消耗代金券总量:</span>
                    <br />
                    <span class="number">{{data.userCoupon}}</span>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 20px" v-show="showData">
            <el-col :span="6">
                <el-card shadow="hover" class="card">
                    <span class="title">当日订单量:</span>
                    <br />
                    <span class="number">{{data.todayPlatformOrderNum}}</span>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="card">
                    <span class="title">当日订单金额:</span>
                    <br />
                    <span class="number">{{data.todayPlatformOrderAmount}}</span>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="card">
                    <span class="title">当日直推返佣:</span>
                    <br />
                    <span class="number">{{data.todayStraightAssetReleaseAmount}}</span>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="card">
                    <span class="title">当日管理奖:</span>
                    <br />
                    <span class="number">{{data.todayMangeAssetReleaseAmount}}</span>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 20px" v-show="showData">
            <el-col :span="6">
                <el-card shadow="hover" class="card">
                    <span class="title">当月订单量:</span>
                    <br />
                    <span class="number">{{data.monthPlatformOrderNum}}</span>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="card">
                    <span class="title">当月订单金额:</span>
                    <br />
                    <span class="number">{{data.monthPlatformOrderAmount}}</span>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="card">
                    <span class="title">当月直推返佣:</span>
                    <br />
                    <span class="number">{{data.monthStraightAssetReleaseAmount}}</span>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="card">
                    <span class="title">当月管理奖:</span>
                    <br />
                    <span class="number">{{data.monthMangeAssetReleaseAmount}}</span>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showData: false,
            data: {
                platformOrderNum: 0,
                platformOrderAmount: 0,
                platformUserNum: 0,
                userCoupon: 0,
                todayPlatformOrderNum: 0,
                todayPlatformOrderAmount: 0,
                todayStraightAssetReleaseAmount: 0,
                todayMangeAssetReleaseAmount: 0,
                monthPlatformOrderNum: 0,
                monthPlatformOrderAmount: 0,
                monthStraightAssetReleaseAmount: 0,
                monthMangeAssetReleaseAmount: 0
            }
        };
    },
    created() {
        this.$http({
            url: this.$http.adornUrl("/sys/user/info"),
            method: "get",
            params: this.$http.adornParams()
        }).then(({ data }) => {
            if (data && data.code === 0) {
                if (data.user.userId == 1) {
                    this.showData = true;
                }
            }
        });

        this.$http({
            url: this.$http.adornUrl(`/api/open/dataStatistics`),
            method: "get"
        }).then(({ data }) => {
            if (data && data.code === 0) {
                this.data = data.data;
            } else {
                this.$message.error(data.msg);
            }
        });
    }
};
</script>

<style>
.mod-home {
    line-height: 1.5;
}
.title {
    font-size: 16px;
    color: white;
}
.number {
    font-size: 36px;
    color: white;
}
.card {
    background: #45c2b5;
}
</style>

