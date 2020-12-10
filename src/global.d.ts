import { Store } from 'vuex'
import { Message } from 'ant-design-vue/types/message'
import { Modal } from 'ant-design-vue/types/modal'
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
  }
}

export {}
