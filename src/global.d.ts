import { Store } from 'vuex'
import { Message } from 'ant-design-vue/types/message'
import { Modal } from 'ant-design-vue/types/modal'
import { VueI18n } from 'vue-i18n'
// declare global {
  
// }

module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<any>
    $message: Message
    $info: Modal.info
    $success: Modal.success
    $error: Modal.error
    $warning: Modal.warning
    $confirm: Modal.confirm
    $i18n: VueI18n
  }
}

export {}
