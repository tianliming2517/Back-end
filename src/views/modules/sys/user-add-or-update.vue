<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="40%">
      <el-steps :active="dataForm.active" finish-status="success" simple style="margin-top: 20px">
        <el-step title="注册"></el-step>
        <el-step title="推荐"></el-step>
        <el-step title="安置"></el-step>
        <el-step title="激活"></el-step>
      </el-steps>
      <el-row v-show="dataForm.active === 1" style="margin-top: 20px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="dataForm.userName" placeholder="登录帐号" class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="dataForm.realName" placeholder="真实姓名" class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
          <el-input v-model="dataForm.password" type="password" placeholder="密码" class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
          <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码" class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="支付密码" prop="payPassword" :class="{ 'is-required': !dataForm.id }">
          <el-input v-model="dataForm.payPassword" type="password" placeholder="支付密码" class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="确认支付密码" prop="comfirmPayPassword" :class="{ 'is-required': !dataForm.id }">
          <el-input v-model="dataForm.comfirmPayPassword" type="password" placeholder="确认支付密码"
                    class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" placeholder="邮箱" class="inputWidth"></el-input>
        </el-form-item>
        <el-row>
          <el-form-item label="手机号" prop="phone">
            <el-select v-model="dataForm.areaCode" default-first-option style="width: 70px">
              <el-option
                v-for="item in areaCodes"
                :key="item.areaCode"
                :label="item.areaCode"
                :value="item.areaCode">
              </el-option>
            </el-select>
            <el-input v-model="dataForm.phone" placeholder="手机号" style="width: 175px"></el-input>
          </el-form-item>
        </el-row>
        <el-form-item label=验证码 prop="authCode">
          <el-input v-model="dataForm.authCode" placeholder="验证码" style="width: 135px"></el-input>
          <el-button @click="sendSms" size="100px">
            发送验证码
          </el-button>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="dataForm.idNumber" placeholder="身份证号" class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleIdList">
          <el-checkbox-group v-model="dataForm.roleIdList" class="inputWidth">
            <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="状态" size="mini" prop="status">
          <el-radio-group v-model="dataForm.status" class="inputWidth">
            <el-radio :label="1">禁用</el-radio>
            <el-radio :label="0">正常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="visible = false" style="text-align: center">取消</el-button>
          <el-button @click="userRegister">确定</el-button>
          <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
        </el-form-item>
      </el-row>
      <el-row v-show="dataForm.active === 2" style="margin-top: 20px">
        <el-form-item label="是否推荐" prop="invite">
          <el-radio-group v-model="dataForm.invite">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否老用户" size="mini" prop="oldUser">
          <el-radio-group v-model="dataForm.oldUser">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="老锁仓资产" prop="oldLockAmount" v-if="dataForm.oldUser === 1">
          <el-input v-model="dataForm.oldLockAmount" placeholder="老锁仓资产" class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-top: 12px;" @click="back">上一步</el-button>
          <el-button @click="invite" :disabled="dataForm.inviteDisable">推荐</el-button>
          <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
        </el-form-item>
      </el-row>
      <el-row v-show="dataForm.active === 3" style="margin-top: 20px">
        <el-form-item label="是否开启自动滑落" prop="auto">
          <el-radio-group v-model="dataForm.auto" @change="changePlacement">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="可安置节点" prop="subordinateCommunity" class="labelFloat" v-if="this.dataForm.manualPlacement">
          <el-select v-model="dataForm.freeNode" placeholder="可安置节点" class="case">
            <el-option
              v-for="item in freeNodes"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-top: 12px;" @click="back">上一步</el-button>
          <el-button @click="placement" :disabled="dataForm.placementDisable">安置</el-button>
          <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
        </el-form-item>
      </el-row>
      <el-row v-show="dataForm.active === 4" style="margin-top: 20px">
        <el-form-item label="选择套餐" prop="combo" class="labelFloat">
          <el-select v-model="dataForm.combo" placeholder="选择套餐" class="inputWidth">
            <el-option
              v-for="item in combos"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购买金额" prop="account">
          <el-input v-model="dataForm.account" placeholder="购买金额" class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="back">上一步</el-button>
          <el-button @click="active" :disabled="dataForm.activeDisable">激活</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
  // import { isEmail, isphone } from '@/utils/validate'
  import MD5 from 'js-md5'

  export default {
    data () {
      return {
        roleList: [],
        combos: [],
        freeNodes: [],
        areaCodes: [],
        visible: true,
        dataForm: {
          active: 1,
          id: 0,
          userName: '',
          realName: '',
          password: '',
          comfirmPassword: '',
          salt: '',
          email: '',
          phone: '',
          roleIdList: [],
          status: 0,
          invite: 0,
          idNumber: '',
          comfirmPayPassword: '',
          payPassword: '',
          freeNode: '',
          combo: '',
          account: '',
          oldUser: 1,
          auto: 1,
          areaCode: '',
          authCode: '',
          oldLockAmount: 0,
          sendSmsBtn: true,
          manualPlacement: false,
          nodeBtn: true,
          inviteBtn: true,
          register: true,
          inviteDisable: false,
          placementDisable: false,
          activeDisable: false
        }
      }
    },
    created () {
      this.getCombos()
      this.getFreeNode()
      this.areaCodes = require('../../common/areaCode')
    },
    methods: {
      next () {
        if (this.dataForm.active++ > 3) this.dataForm.active = 0
      },
      back () {
        if (this.dataForm.active-- < 0) this.dataForm.active = 0
      },
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/role/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.roleList = data && data.code === 0 ? data.list : []
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userName = data.user.userName
                this.dataForm.realName = data.user.realName
                this.dataForm.salt = data.user.salt
                this.dataForm.email = data.user.email
                this.dataForm.phone = data.user.phone
                this.dataForm.roleIdList = data.user.roleIdList
                this.dataForm.status = data.user.status
                this.dataForm.areaCode = data.user.areaCode
                this.dataForm.idNumber = data.user.idNumber
                if (data.user.activeStatus === 1) { // 已经激活
                  this.dataForm.inviteDisable = true
                  this.dataForm.placementDisable = true
                  this.dataForm.activeDisable = true
                }
                if (data.user.activeStatus === 0 && data.user.placementStatus === 1) {
                  // 安置未激活
                  this.dataForm.inviteDisable = true
                  this.dataForm.placementDisable = true
                }
                if (data.user.activeStatus === 0 && data.user.placementStatus === 0 && data.user.inviteStatus === 1) {
                  // 推荐未激活
                  this.dataForm.inviteDisable = true
                }
              }
            })
          }
        })
      },
      // 表单提交
      userRegister () {
        this.$refs['dataForm'].validate((valid) => {
          if (this.dataForm.password != this.dataForm.comfirmPassword) {
            this.$message.error("两次输入的登陆密码不一致")
            return
          }
          if (this.dataForm.payPassword != this.dataForm.comfirmPayPassword) {
            this.$message.error("两次输入的支付密码不一致")
            return
          }
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'register' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'userName': this.dataForm.userName,
                'realName': this.dataForm.realName,
                'password': this.dataForm.password,
                'payPassword': this.dataForm.payPassword,
                'email': this.dataForm.email,
                'areaCode': this.dataForm.areaCode,
                'phone': this.dataForm.phone,
                'authCode': this.dataForm.authCode,
                'idNumber': this.dataForm.idNumber,
                'status': this.dataForm.status,
                'roleIdList': this.dataForm.roleIdList
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message.success("操作成功")
                this.next();
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      sendSms () {
        this.$http({
          url: this.$http.adornUrl(`/sys/user/sendSms`),
          method: 'post',
          data: this.$http.adornData({
            'phone': this.dataForm.phone,
            'areaCode': '+' + this.dataForm.areaCode
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('验证码发送成功')
            this.sendSmsBtn = true
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      getCombos () {
        this.$http({
          url: this.$http.adornUrl(`/api/combo/list`),
          method: 'post'
        }).then(({data}) => {
          if (data && data.code === 0) {
            data.data.forEach(combo => {
              this.combos.push({
                key: combo.memberLevel,
                value: combo.investMin + '--' + combo.investMax
              })
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      getFreeNode () {
        this.$http({
          url: this.$http.adornUrl(`/sys/user/freeNodes`),
          method: 'post'
        }).then(({data}) => {
          if (data && data.code === 0) {
            data.data.forEach(freeNode => {
              this.freeNodes.push({
                key: freeNode.nodeId,
                value: freeNode.userName + freeNode.nodeName
              })
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      changePlacement () {
        this.dataForm.manualPlacement = !this.dataForm.manualPlacement
      },
      invite () {
        this.$http({
          url: this.$http.adornUrl(`/sys/user/invite`),
          method: 'post',
          data: this.$http.adornData({
            'userName': this.dataForm.userName,
            'invite': this.dataForm.invite,
            'oldUser': this.dataForm.oldUser,
            'oldLockAmount': this.dataForm.oldLockAmount
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('用户推荐成功')
            this.next();
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      placement () {
        this.$http({
          url: this.$http.adornUrl(`/sys/user/placement`),
          method: 'post',
          data: this.$http.adornData({
            'nodeId': this.dataForm.freeNode,
            'auto': this.dataForm.auto,
            'userName': this.dataForm.userName,
            'oldLockAmount': this.dataForm.oldLockAmount
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('用户推荐成功')
            this.next();
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      active () {
        this.$http({
          url: this.$http.adornUrl(`/sys/user/active`),
          method: 'post',
          data: this.$http.adornData({
            'userName': this.dataForm.userName,
            'comboLevel': this.dataForm.combo,
            'customerAmount': this.dataForm.account,
            'signType': 'MD5',
            'sign': MD5('comboLevel:' + this.dataForm.combo + ',customerAmount:' + this.dataForm.account + ',userName:' + this.dataForm.userName + ',signType:MD5'),
            'isCoupon': false,
            'couponId': 0,
            'coupon': 0
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '用户激活成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
</script>

<style>
  el-row {
    margin-left: 20px;
    margin-top: 20px;
  }

  .inputWidth {
    width: 250px;
  }
</style>
