<template>
  <div class="info-container">
    <el-card class="header-card">
      <div class="info-header">
        <h2 class="title">个人信息</h2>
        <div class="button-group">
          <el-button type="primary" icon="el-icon-edit" @click="update">修改信息</el-button>
          <el-button type="warning" icon="el-icon-key" @click="showUpdatePwd">修改密码</el-button>
        </div>
      </div>
    </el-card>
    
    <el-card class="info-card">
      <div class="info-content">
        <div class="info-item">
          <div class="info-label">账号</div>
          <div class="info-value">{{ userInfo.account }}</div>
        </div>
        <el-divider></el-divider>
        
        <div class="info-item">
          <div class="info-label">手机号码</div>
          <div class="info-value">{{ userInfo.phone || '暂未设置' }}</div>
        </div>
        <el-divider></el-divider>
        
        <div class="info-item">
          <div class="info-label">邮箱地址</div>
          <div class="info-value">{{ userInfo.email || '暂未设置' }}</div>
        </div>
        <el-divider></el-divider>

        <div class="info-item">
          <div class="info-label">收货地址</div>
          <div class="info-value">{{ userInfo.address || '暂未设置' }}</div>
        </div>
      </div>
    </el-card>

    <!-- 修改信息对话框 -->
    <el-dialog
      title="修改个人信息"
      :visible.sync="updateDialogVisible"
      width="400px"
      :close-on-click-modal="false"
      center>
      <el-form :model="updateUser" label-width="80px" :rules="rules" ref="updateForm">
        <el-form-item label="账号">
          <el-input v-model="updateUser.account" disabled>
            <i slot="prefix" class="el-icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="updateUser.phone" placeholder="请输入手机号码">
            <i slot="prefix" class="el-icon-mobile-phone"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateUser.email" placeholder="请输入邮箱地址">
            <i slot="prefix" class="el-icon-message"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input v-model="updateUser.address" placeholder="请输入收货地址">
            <i slot="prefix" class="el-icon-location"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdate">取 消</el-button>
        <el-button type="primary" @click="doUpdate" :loading="updating">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="pwdDialogVisible"
      width="400px"
      :close-on-click-modal="false"
      center>
      <el-form :model="pwdForm" label-width="100px" :rules="pwdRules" ref="pwdForm">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input 
            v-model="pwdForm.oldPassword" 
            type="password" 
            show-password
            placeholder="请输入原密码">
            <i slot="prefix" class="el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="pwdForm.newPassword" 
            type="password" 
            show-password
            placeholder="请输入新密码">
            <i slot="prefix" class="el-icon-key"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input 
            v-model="pwdForm.confirmPassword" 
            type="password" 
            show-password
            placeholder="请再次输入新密码">
            <i slot="prefix" class="el-icon-key"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdatePwd">取 消</el-button>
        <el-button type="warning" @click="doUpdatePwd" :loading="updatingPwd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 手机号验证规则
    const validatePhone = (rule, value, callback) => {
      if (value && !/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号码'));
      } else {
        callback();
      }
    };
    // 邮箱验证规则
    const validateEmail = (rule, value, callback) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        callback(new Error('请输入正确的邮箱地址'));
      } else {
        callback();
      }
    };
    // 密码验证规则
    const validateNewPassword = (rule, value, callback) => {
      if (value === this.pwdForm.oldPassword) {
        callback(new Error('新密码不能与原密码相同'));
      } else {
        if (this.pwdForm.confirmPassword !== '') {
          this.$refs.pwdForm.validateField('confirmPassword');
        }
        callback();
      }
    };
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.pwdForm.newPassword) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };

    return {
      userInfo: {
        uid: window.sessionStorage.getItem('uid'),
        account: window.sessionStorage.getItem('account'),
        phone: '',
        email: '',
        address: ''
      },
      user: {
        uid: window.sessionStorage.getItem('uid'),
        account: window.sessionStorage.getItem('account'),
      },
      updateDialogVisible: false,
      pwdDialogVisible: false,
      updating: false,
      updatingPwd: false,
      updateUser: {
        uid: '',
        account: '',
        phone: '',
        email: '',
        address: ''
      },
      pwdForm: {
        uid: window.sessionStorage.getItem('uid'),
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ]
      },
      pwdRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' },
          { validator: validateNewPassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    
    fetchUserInfo() {
      const uid = this.user.uid;
      if (!uid) {
        this.$message.error('用户未登录');
        return;
      }
      
      this.$http.post("/user/selectUserInfo", {
        uid: uid
      }).then(res => {
        if (res.data.code === 1000) {
          this.userInfo = res.data.data;
          console.log('获取用户信息成功:', this.userInfo);
        } else {
          this.$message.error(res.data.message || '获取用户信息失败');
        }
      }).catch(err => {
        console.error('获取用户信息错误:', err);
        this.$message.error('获取用户信息失败');
      });
    },
    
    update() {
      console.log('点击修改信息按钮');
      this.updateUser = {
        uid: this.userInfo.uid,
        account: this.userInfo.account,
        phone: this.userInfo.phone,
        email: this.userInfo.email,
        address: this.userInfo.address
      };
      this.updateDialogVisible = true;
    },

    showUpdatePwd() {
      console.log('点击修改密码按钮');
      this.pwdDialogVisible = true;
    },

    cancelUpdate() {
      this.updateDialogVisible = false;
      if (this.$refs.updateForm) {
        this.$refs.updateForm.resetFields();
      }
    },

    cancelUpdatePwd() {
      this.pwdDialogVisible = false;
      if (this.$refs.pwdForm) {
        this.$refs.pwdForm.resetFields();
      }
    },

    doUpdate() {
      if (!this.$refs.updateForm) {
        console.error('updateForm ref not found');
        return;
      }
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.updating = true;
          console.log('提交更新信息:', this.updateUser);
          this.$http.put("/user/updateUserInfo", {
            uid: this.updateUser.uid,
            phone: this.updateUser.phone,
            email: this.updateUser.email,
            address: this.updateUser.address
          }).then(res => {
            if (res.data.code === 1000) {
              this.$message.success('修改成功');
              this.updateDialogVisible = false;
              this.fetchUserInfo();
            } else {
              this.$message.error(res.data.message || '更新失败');
            }
            this.updating = false;
          }).catch(err => {
            console.error('更新用户信息错误:', err);
            this.$message.error('更新失败');
            this.updating = false;
          });
        }
      });
    },

    doUpdatePwd() {
      if (!this.$refs.pwdForm) {
        console.error('pwdForm ref not found');
        return;
      }
      this.$refs.pwdForm.validate(valid => {
        if (valid) {
          this.updatingPwd = true;
          console.log('提交密码更新:', { uid: this.pwdForm.uid });
          this.$http.put("/user/updatePwd", {
            uid: this.pwdForm.uid,
            oldPassword: this.pwdForm.oldPassword,
            newPassword: this.pwdForm.newPassword
          }).then(res => {
            if (res.data.code === 1000) {
              this.$message.success('密码修改成功，请重新登录');
              this.pwdDialogVisible = false;
              setTimeout(() => {
                this.$router.push('/login');
              }, 1500);
            } else {
              this.$message.error(res.data.message || '更新密码失败');
            }
            this.updatingPwd = false;
          }).catch(err => {
            console.error('更新密码错误:', err);
            this.$message.error('更新密码失败');
            this.updatingPwd = false;
          });
        }
      });
    }
  },
  created() {
    this.fetchUserInfo();
  }
}
</script>

<style scoped>
.info-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.header-card {
  margin-bottom: 20px;
  background-color: #f8f9fa;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 10px;
}

.title {
  margin: 0;
  color: #409EFF;
  font-size: 24px;
}

.info-card {
  background-color: #fff;
}

.info-content {
  padding: 20px;
}

.info-item {
  display: flex;
  padding: 15px 0;
}

.info-label {
  width: 100px;
  color: #606266;
  font-weight: bold;
}

.info-value {
  flex: 1;
  color: #333;
}

.info-value:empty::before {
  content: '暂未设置';
  color: #909399;
  font-style: italic;
}

.dialog-footer {
  text-align: right;
}

.el-divider {
  margin: 0;
}

/* 输入框图标样式 */
.el-input .el-input__prefix {
  left: 10px;
}

.el-input .el-input__inner {
  padding-left: 35px;
}

/* 新增的密码框样式 */
.el-form-item {
  margin-bottom: 25px;
}
</style>