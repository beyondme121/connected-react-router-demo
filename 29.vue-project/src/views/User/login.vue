<template>
  <div>
    <el-row>
      <h3 style="text-align:center; margin-bottom: 20px;">登录</h3>
    </el-row>
    <el-row>
      <el-col :span="10" :offset="6">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="验证码">
            <el-row>
              <el-col :span="16">
                <el-input v-model="ruleForm.code" type="text"></el-input>
              </el-col>
              <el-col :span="8">
                <div v-html="svg" @click="getCaptcha"></div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { v4 } from "uuid";
import { getCaptcha } from "@/api/public";
import { getLocal, setLocal } from "@/utils/local";
import { createNamespacedHelpers } from "vuex";
import * as types from "@/store/action-types";
// let { mapActions } = createNamespacedHelpers(["user"]);
let { mapActions } = createNamespacedHelpers("user");

export default {
  created() {
    this.uuid = getLocal("uuid");
    if (!this.uuid) {
      this.uuid = v4();
      setLocal("uuid", this.uuid);
    }
    this.getCaptcha();
  },
  data() {
    return {
      svg: "",
      ruleForm: {
        username: "",
        password: "",
        code: "",
      },
      rules: {
        username: [
          { required: true, message: "用户名必须输入", trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "用户必须输入密码", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    ...mapActions([types.SET_USER_LOGIN]),
    async getCaptcha(uuid) {
      this.svg = await getCaptcha(this.uuid);
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        // valid: true/false
        if (valid) {
          // 请求接口, vuex中的actions
          await this[types.SET_USER_LOGIN]({
            ...this.ruleForm,
            uid: this.uuid,
          });
          this.$router.push("/");
        } else {
          console.log("false...");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style></style>
