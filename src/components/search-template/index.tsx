import { defineComponent, PropType, onMounted, reactive, ref } from 'vue'
import type { Form } from 'ant-design-vue/types/form/form'
import moment from 'moment'
import TimeRangeSelection from '../time-range-selection/index.vue'

export interface OptionsType<T = any, k = any> {
  title: string
  key: string
  type: string
  selectListValue?: T[]
  selectLableName?: string
  selectKeyValue?: string
  selectListchildren?: k[]
  defaultValue?: any
  onChange?: any
  placeholder?: string
}

export interface SearchCompentType<T, K> {
  options: OptionsType<T, K>[]
  callBack: Function
}

const QueryTemplate = defineComponent({
  props: {
    options: {
      type: Array as PropType<OptionsType[]>,
      default: () => [
        {
          title: '日期',
          key: 'date',
          type: 'timeRangeSelection',
          selectListValue: [],
          selectLableName: '',
          selectKeyValue: '',
          selectListchildren: []
        }
      ]
    },
    callBack: {
      type: Function
    }
  },
  setup(props) {
    const formRef = ref<Form>()
    const form = reactive({})

    onMounted(() => {
      const filteredOptions =
        props.options.filter(item => item.defaultValue) || []
      if (filteredOptions.length) {
        filteredOptions.forEach(item => {
          if (item.type === 'monthDatePicker') {
            Object.assign(form, {
              [item.key]: moment(item.defaultValue, 'YYYY-MM')
            })
          } else {
            Object.assign(form, {
              [item.key]: moment(item.defaultValue)
            })
          }
        })
      }
    })

    function onFinish(value: any) {
      const formData = Object.assign({}, value)
      props.options.forEach(item => {
        const rangeValue = value[item.key]
        switch (item.type) {
          case 'showTimeRangePicker': {
            formData[item.key] = rangeValue
              ? rangeValue.map((item: moment.Moment) => {
                  return new Date(item.format('YYYY-MM-DD HH:mm:ss')).getTime()
                })
              : []
            break
          }

          case 'timeRangeSelection': {
            formData[item.key] =
              rangeValue &&
              rangeValue.map((item: moment.Moment) => {
                return item.format('YYYY-MM-DD')
              })
            break
          }

          case 'monthDatePicker': {
            formData[item.key] =
              rangeValue && moment(rangeValue).format('YYYY-MM')
            break
          }

          case 'dayDatePicker': {
            formData[item.key] =
              rangeValue && new Date(rangeValue.format('YYYY-MM-DD')).getTime()
            break
          }

          default: {
            // ...
          }
        }
      })
      props.callBack && props.callBack(formData)
    }

    function onReset() {
      formRef.value?.resetFields()
      props.callBack && props.callBack(form)
    }

    function disabledDate(current: any): boolean {
      return current && current > moment().endOf('day')
    }

    function getTemplateByType(type: string, opts: Required<OptionsType>) {
      const templateObj = {
        input: (
          <a-input
            onChange={opts.onChange}
            placeholder={opts.placeholder || '请填写'}
          ></a-input>
        ),
        select: (
          <a-select
            placeholder={opts.placeholder || '请填写'}
            onChange={opts.onChange}
          >
            {opts.selectListValue?.map((item, index) => (
              <a-option key={index} value={item[opts.selectKeyValue]}>
                {item[opts.selectLableName]}
              </a-option>
            ))}
          </a-select>
        ),
        cascader: (
          <a-cascader
            options={opts.selectListValue}
            placeholder={opts.placeholder || '请填写'}
            fieldNames={{
              label: 'opts.selectLableName',
              value: 'opts.selectKeyValue',
              children: 'opts.selectListchildren'
            }}
            changeOnSelect
          ></a-cascader>
        ),
        timeRangeSelection: (
          <TimeRangeSelection
            onChange={opts.onChange}
            placeholder={opts.placeholder || '请填写'}
          ></TimeRangeSelection>
        ),
        showTimeRangePicker: (
          <a-range-picker
            onChange={opts.onChange}
            placeholder={opts.placeholder || '请填写'}
          ></a-range-picker>
        ),
        monthDatePicker: (
          <a-date-picker
            mode="month"
            onChange={opts.onChange}
            placeholder={opts.placeholder || '请填写'}
            disabledDate={disabledDate}
          ></a-date-picker>
        )
      }
      type Key = keyof typeof templateObj
      const template = templateObj[type as Key]
      if (template) {
        return template
      }
      return (
        <a-input
          onChange={opts.onChange}
          placeholder={opts.placeholder || '请填写'}
        ></a-input>
      )
    }

    return () => {
      return (
        <a-form ref={formRef} onFinish={onFinish}>
          <a-row gutter={[15, 15]}>
            {props.options.map((item, index) => (
              <a-col
                xs={24}
                sm={12}
                md={12}
                lg={8}
                xl={props.options.length > 3 ? 6 : 8}
                key={index}
              >
                <a-form-item label={item.title} name={item.key}>
                  {getTemplateByType(item.type, item as Required<OptionsType>)}
                </a-form-item>
              </a-col>
            ))}
            <a-col
              xs={24}
              sm={12}
              md={12}
              lg={8}
              xl={props.options.length > 3 ? 6 : 8}
            >
              <a-form-item>
                <a-button htmlType="submit">查询</a-button>
                <a-button onClick={onReset}>重置</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      )
    }
  }
})

export default QueryTemplate
