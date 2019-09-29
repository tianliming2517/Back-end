<template>
    <div class="mod-cash">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
                <el-button @click="reload()">刷新</el-button>
                <el-button
                    v-if="isAuth('sys:user:save')"
                    type="primary"
                    @click="addOrUpdateHandle()"
                >新增</el-button>
                <!-- <el-button @click="provideCoupon" :disabled="dataListSelections.length != 1">发放优惠券</el-button> -->
                <!-- <el-button>状态</el-button> -->
                <el-dropdown :hide-on-click="false">
                    <span class="el-dropdown-link">
                        <el-button>
                            状态
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="getDataList(0)">未完成</el-dropdown-item>
                        <el-dropdown-item @click.native="getDataList(1)">完成</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-form-item>
            <div class="batch">
                <el-button @click="changeStatus">状态修改</el-button>
            </div>
        </el-form>
        <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            style="width: 100%;"
        >
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column
                prop="userId"
                header-align="center"
                align="center"
                width="80"
                label="用户ID"
            ></el-table-column>
            <el-table-column prop="walletName" header-align="center" align="center" label="钱包名称"></el-table-column>
            <el-table-column prop="fromAddress" header-align="center" align="center" label="转账钱包地址"></el-table-column>
            <el-table-column prop="toAddress" header-align="center" align="center" label="转账接受地址"></el-table-column>
            <el-table-column prop="amount" header-align="center" align="center" label="转账数量"></el-table-column>
            <el-table-column prop="transferTime" header-align="center" align="center" label="转账时间"></el-table-column>
            <el-table-column prop="token" header-align="center" align="center" label="币种"></el-table-column>
            <el-table-column prop="hash" header-align="center" align="center" label="交易hash"></el-table-column>
            <el-table-column prop="status" header-align="center" align="center" label="状态"></el-table-column>
            <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
            <!-- <el-table-column prop="status" header-align="center" align="center" label="转账时间">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status === 1" size="small" type="danger">禁用</el-tag>
                    <el-tag v-else size="small">正常</el-tag>
                </template>
            </el-table-column>-->
            <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="150"
                label="操作"
            >
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                    <el-button
                        type="text"
                        size="small"
                        @click="freezeUser(scope.row.id)"
                        v-show="scope.row.status === 0"
                    >冻结</el-button>
                    <el-button
                        type="text"
                        size="small"
                        @click="unFreezeUser(scope.row.id)"
                        v-show="scope.row.status === 1"
                    >解冻</el-button>
                    <el-button
                        type="text"
                        size="small"
                        @click="freezeUsers(scope.row.id)"
                        v-show="scope.row.status === 0"
                    >冻结所有邀请人</el-button>
                    <el-button
                        type="text"
                        size="small"
                        @click="unFreezeUsers(scope.row.id)"
                        v-show="scope.row.status === 1"
                    >解冻所有邀请人</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import AddOrUpdate from "./user-add-or-update";

export default {
    data() {
        return {
            dataForm: {
                userName: ""
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            userIds:''
        };
    },
    components: {
        AddOrUpdate
    },
    activated() {
        this.getDataList();
    },
    methods: {
        reload() {
            location.reload();
        },
        // 批量修改
        changeStatus(){
            var ids = this.userIds;
            // 现后端暂不支持id=1的操作，所以先将其删除
            if(ids.includes(1)){
                ids.splice(0,1);
            }

            var userIds = ids.join(',');

            this.$http({
                url: this.$http.adornUrl("/sys/menu/confirmWithdraw"),
                method: "get",
                params: this.$http.adornParams({
                    userIds
                })
            }).then(({ data }) => {
                // console.log(data);
                this.getDataList();
                // if (data && data.code === 0) {
                    
                // } else {
                //     this.dataList = [];
                //     this.totalPage = 0;
                // }
                // this.dataListLoading = false;
            });
        },
        // 获取数据列表
        getDataList(key) {
            this.dataListLoading = true;
            // var cookies = document.cookie;
            this.$http({
                url: this.$http.adornUrl("/sys/menu/selectAssetWalletRecord"),
                method: "get",
                params: this.$http.adornParams({
                    status:key,
                    currPage: this.pageIndex,
                    pageSize: this.pageSize,

                })
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    // 遍历修改status状态
                    for(let key of data.data.list){
                        key.status = key.status==1 ? '完成' : '未完成';
                    }
                    this.dataList = data.data.list;
                    this.totalPage = data.data.total;

                } else {
                    this.dataList = [];
                    this.totalPage = 0;
                }
                this.dataListLoading = false;
            });
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.pageIndex = 1;
            this.getDataList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageIndex = val;
            this.getDataList();
        },
        // 多选
        selectionChangeHandle(val) {
            this.dataListSelections = val;
            var arr = [];
            for(let key of val){
                // console.log(key)
                arr.push(key.id);
            }
            this.userIds = arr;
        },
        // 新增 / 修改
        addOrUpdateHandle(id) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id);
            });
        },
        // 删除
        deleteHandle(id) {
            var userIds = id
                ? [id]
                : this.dataListSelections.map(item => {
                      return item.userId;
                  });
            this.$confirm(
                `确定对[id=${userIds.join(",")}]进行[${
                    id ? "删除" : "批量删除"
                }]操作?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl("/sys/user/delete"),
                        method: "post",
                        data: this.$http.adornData(userIds, false)
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.$message({
                                message: "操作成功",
                                type: "success",
                                duration: 1500,
                                onClose: () => {
                                    this.getDataList();
                                }
                            });
                        } else {
                            this.$message.error(data.msg);
                        }
                    });
                })
                .catch(() => {});
        },
        freezeUser(id) {
            this.$http({
                url: this.$http.adornUrl(`/sys/user/freezeUser/` + id),
                method: "post"
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    this.$message.success("用户冻结成功");
                    this.getDataList();
                } else {
                    this.$message.error(data.msg);
                }
            });
        },
        freezeUsers(id) {
            this.$http({
                url: this.$http.adornUrl(`/sys/user/freezeUsers/` + id),
                method: "post"
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    this.$message.success("用户批量冻结成功");
                    this.getDataList();
                } else {
                    this.$message.error(data.msg);
                }
            });
        },
        unFreezeUser(id) {
            this.$http({
                url: this.$http.adornUrl(`/sys/user/unFreezeUser/` + id),
                method: "post"
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    this.$message.success("用户解冻成功");
                    this.getDataList();
                } else {
                    this.$message.error(data.msg);
                }
            });
        },
        unFreezeUsers(id) {
            this.$http({
                url: this.$http.adornUrl(`/sys/user/unFreezeUsers/` + id),
                method: "post"
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    this.$message.success("用户批量解冻成功");
                    this.getDataList();
                } else {
                    this.$message.error(data.msg);
                }
            });
        }
        // provideCoupon() {
        //     let userId = this.dataListSelections.map(item => {
        //         return item.id;
        //     });
        //     this.$prompt("请输入代金券金额", "提示", {
        //         confirmButtonText: "确定",
        //         cancelButtonText: "取消",
        //         inputPattern: /^[0-9]*$/,
        //         inputErrorMessage: "代金券金额不正确"
        //     })
        //         .then(({ value }) => {
        //             this.$http({
        //                 url: this.$http.adornUrl(`/sys/user/provideCoupon`),
        //                 method: "post",
        //                 data: this.$http.adornData({
        //                     id: userId[0],
        //                     coupon: value
        //                 })
        //             }).then(({ data }) => {
        //                 if (data && data.code === 0) {
        //                     this.$message.success("发放代金券成功");
        //                     this.getDataList();
        //                 } else {
        //                     this.$message.error(data.msg);
        //                 }
        //             });
        //         })
        //         .catch(() => {
        //             this.$message({
        //                 type: "info",
        //                 message: "取消输入"
        //             });
        //         });
        // }
    }
};
</script>

<style lang="scss">
.batch{
    float: right;
}
</style>