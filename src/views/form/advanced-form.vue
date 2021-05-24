<template>
  <div class="com-page p20">
    <a-row :gutter="[10, 20]" type="flex">
      <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <a-form class="form" :model="form" :rules="rules" label-align="left">
          <a-form-item label="平台" name="platform">
            <a-input v-model:value="form.platform" placeholder="请填写" />
          </a-form-item>
          <a-form-item label="语言" name="lang">
            <a-select v-model:value="form.lang">
              <a-select-option
                v-for="item in langeList"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="时间" name="times">
            <TimeRangeSelection v-model:value="form.times"></TimeRangeSelection>
          </a-form-item>
          <transition-group name="list">
            <div
              v-for="(item, index) in form.userInfoList"
              :key="index"
              class="item"
            >
              <a-divider>信息{{ index + 1 }}</a-divider>
              <div v-show="index > 0">
                <a-button
                  class="button--delete"
                  type="danger"
                  shape="circle"
                  @click="onRemoveStep(index)"
                >
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </div>
              <a-form-item
                label="名字"
                name="names"
                :rules="[{ required: true, message: '请填写描述!' }]"
              >
                <a-input v-model:value="item.names" placeholder="请填写" />
              </a-form-item>
              <a-form-item
                label="性别"
                name="sex"
                :rules="[{ required: true, message: '请选择性别!' }]"
              >
                <a-radio-group v-model:value="item.sex">
                  <a-radio :value="1">男</a-radio>
                  <a-radio :value="2">女</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item
                label="地址"
                name="address"
                :rules="[{ required: true, message: '请填写地址!' }]"
              >
                <a-input v-model:value="item.address" placeholder="请填写" />
              </a-form-item>
              <a-form-item
                label="学校"
                name="school"
                :rules="[{ required: true, message: '请填写学校!' }]"
              >
                <a-input v-model:value="item.school" placeholder="请填写" />
              </a-form-item>
              <a-form-item
                label="年龄"
                name="age"
                :rules="[{ required: true, message: '请填写年龄!' }]"
              >
                <a-input-number v-model:value="item.age" placeholder="请填写" />
              </a-form-item>
              <a-form-item
                label="出生日期"
                name="birth"
                :rules="[{ required: true, message: '请填写出生日期!' }]"
              >
                <a-date-picker v-model:value="item.birth" />
              </a-form-item>
            </div>
          </transition-group>
          <a-row type="flex" align="middle" class="button-group">
            <a-button type="danger" @click="onAddStep" class="mr8">
              新增信息
            </a-button>
            <a-button type="primary" @click="onSubmit">提交信息</a-button>
          </a-row>
        </a-form>
      </a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="16" :xl="16">
        <a-row type="flex" align="middle" class="button-group">
          <a-button type="danger" @click="onAddStep" class="mr8">
            新增信息
          </a-button>
          <a-button type="primary" @click="onSubmit">提交信息</a-button>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import TimeRangeSelection from '@/components/time-range-selection/index.vue'
import moment from 'moment'
const langeListData = [
  { label: 'js', value: 1 },
  { label: 'java', value: 2 },
  { label: 'c', value: 3 }
]

type UserInfoItemType = {
  names: string
  sex: number
  address: string
  school: string
  age: number
  birth: moment.Moment | null
}

function genUserInfoItem(): UserInfoItemType {
  return {
    names: '',
    sex: 1,
    address: '',
    school: '',
    age: 24,
    birth: null
  }
}
export default defineComponent({
  components: {
    TimeRangeSelection,
    DeleteOutlined
  },
  setup() {
    const form = reactive({
      platform: '',
      lang: 2,
      times: [],
      userInfoList: [
        {
          names: '帅峰峰',
          sex: 1,
          address: '北京海定区',
          school: '北京技术技术大学',
          age: 24,
          birth: moment('2015-01-01')
        }
      ] as UserInfoItemType[]
    })
    const rules = reactive({})

    const langeList = reactive(langeListData)

    function onAddStep() {
      form.userInfoList.push(genUserInfoItem())
    }
    function onRemoveStep(index: number) {
      form.userInfoList.splice(index, 1)
    }
    function onSubmit() {
      console.log('onSubmit')
    }
    return {
      form,
      rules,
      langeList,
      onAddStep,
      onSubmit,
      onRemoveStep
    }
  }
})
</script>

<style lang="less" scoped>
.form {
  ::v-deep .ant-form-item {
    display: flex;
  }
  ::v-deep .ant-form-item-control-wrapper {
    flex: 1;
  }
}
.button-group {
  height: 100%;
  border-left: 1px solid #f0f0f0;
  padding-left: 20px;
  margin-left: 20px;
}
.item {
  position: relative;
}
.button--delete {
  float: right;
  margin-left: 20px;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.3s;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
