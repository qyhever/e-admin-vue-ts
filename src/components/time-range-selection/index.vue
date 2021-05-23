<template>
  <a-range-picker :value="value" @Change="v => onChange(v)" :ranges="ranges" />
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import dayjs from 'dayjs'
// import { getMonthDay } from '@/utils/date'
// const monthTime = () => {
//   // 上个月的处理
//   let startTime = []
//   let endTime = []
//   if (!dayjs().month()) {
//     // 等于0，刚好1月的时候
//     startTime = [dayjs().year() - 1, 11, 1, '00', '00', '00']
//     endTime = [
//       dayjs().year() - 1,
//       11,
//       getMonthDay(dayjs().year() - 1, 11),
//       '23',
//       '59',
//       '59'
//     ]
//   } else {
//     startTime = [dayjs().year() - 1, dayjs().month() - 1, 1, '00', '00', '00']
//     endTime = [
//       dayjs().year() - 1,
//       dayjs().month() - 1,
//       getMonthDay(dayjs().year() - 1, dayjs().month() - 1),
//       '23',
//       '59',
//       '59'
//     ]
//   }
//   return { startTime, endTime }
// }

export default defineComponent({
  emits: ['update:value'],
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const ranges = reactive({
      今天: [dayjs().startOf('day'), dayjs().endOf('day')],
      // 昨天: [
      //   dayjs([
      //     dayjs().year(),
      //     dayjs().month(),
      //     dayjs().date() - 1,
      //     '00',
      //     '00',
      //     '00'
      //   ]),
      //   dayjs([
      //     dayjs().year(),
      //     dayjs().month(),
      //     dayjs().date() - 1,
      //     '23',
      //     '59'
      //     '59'
      //   ])
      // ],
      最近7天: [
        dayjs(new Date().getTime() - 3600 * 1000 * 24 * 6),
        dayjs(new Date())
      ],
      最近30天: [
        dayjs(new Date().getTime() - 3600 * 1000 * 24 * 29),
        dayjs(new Date())
      ],
      本月: [dayjs().startOf('month'), dayjs().endOf('month')]
      // 上月: [dayjs(monthTime().startTime), dayjs(monthTime().endTime)]
    })
    function onChange(value: any) {
      const val = value.map((v: any) => v.format('YYYY-MM-DD'))
      emit('update:value', val)
    }
    return {
      ranges,
      onChange
    }
  }
})
</script>

<style lang="less" scoped>
// ...
</style>
