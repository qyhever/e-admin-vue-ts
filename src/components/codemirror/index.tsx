import { defineComponent, PropType } from 'vue'
import codemirror from 'codemirror'
import { isEqual } from 'lodash'
/* eslint-disable */

export interface DefineModeOptions {
  fn: () => codemirror.Mode<any>
  name: string
}

export interface SetScrollOptions {
  x?: number | null
  y?: number | null
}

export interface SetSelectionOptions {
  anchor: codemirror.Position
  head: codemirror.Position
}

export interface DomEvent {
  (editor: codemirror.Editor, event?: any): void
}

export interface KeyHandledEvent {
  (editor: codemirror.Editor, name: string, event: any): void
}

export interface EditorChangeEvent {
  (editor: codemirror.Editor, changeObj: codemirror.EditorChange): void
}

export interface CodeMirror {
  autoCursor?: boolean
  autoScroll?: boolean
  className?: string
  cursor?: codemirror.Position
  defineMode?: DefineModeOptions
  editorDidConfigure?: (editor: codemirror.Editor) => void
  editorDidMount?: (
    editor: codemirror.Editor,
    value: string,
    cb: () => void
  ) => void
  editorWillUnmount?: (lib: any) => void
  onBlur?: DomEvent
  onChange?: (
    editor: codemirror.Editor,
    data: codemirror.EditorChange,
    value: string
  ) => void
  onContextMenu?: DomEvent
  onCopy?: DomEvent
  onCursor?: (editor: codemirror.Editor, data: codemirror.Position) => void
  onCut?: DomEvent
  onCursorActivity?: (editor: codemirror.Editor) => void
  onDblClick?: DomEvent
  onDragEnter?: DomEvent
  onDragLeave?: DomEvent
  onDragOver?: DomEvent
  onDragStart?: DomEvent
  onDrop?: DomEvent
  onFocus?: DomEvent
  onGutterClick?: (
    editor: codemirror.Editor,
    lineNumber: number,
    gutter: string,
    event: Event
  ) => void
  onInputRead?: EditorChangeEvent
  onKeyDown?: DomEvent
  onKeyHandled?: KeyHandledEvent
  onKeyPress?: DomEvent
  onKeyUp?: DomEvent
  onMouseDown?: DomEvent
  onPaste?: DomEvent
  onRenderLine?: (
    editor: codemirror.Editor,
    line: codemirror.LineHandle,
    element: HTMLElement
  ) => void
  onScroll?: (editor: codemirror.Editor, data: codemirror.ScrollInfo) => void
  onSelection?: (editor: codemirror.Editor, data: any) => void
  onTouchStart?: DomEvent
  onUpdate?: (editor: codemirror.Editor) => void
  onViewportChange?: (
    editor: codemirror.Editor,
    start: number,
    end: number
  ) => void
  options?: codemirror.EditorConfiguration
  selection?: { ranges: Array<SetSelectionOptions>; focus?: boolean }
  scroll?: SetScrollOptions
}

export interface ControlledCodeMirror extends CodeMirror {
  onBeforeChange: (
    editor: codemirror.Editor,
    data: codemirror.EditorChange,
    value: string
  ) => void
  value: string
}

export interface UnControlledCodeMirror extends CodeMirror {
  detach?: boolean
  editorDidAttach?: (editor: codemirror.Editor) => void
  editorDidDetach?: (editor: codemirror.Editor) => void
  onBeforeChange?: (
    editor: codemirror.Editor,
    data: codemirror.EditorChange,
    value: string,
    next: () => void
  ) => void
  value?: string
}

interface CommonType {
  wire: (props: ControlledCodeMirror | UnControlledCodeMirror) => void
  apply: (props: ControlledCodeMirror | UnControlledCodeMirror) => void
  applyNext: (
    props: ControlledCodeMirror | UnControlledCodeMirror,
    next?: ControlledCodeMirror | UnControlledCodeMirror,
    preserved?: PreservedOptions
  ) => void
  applyUserDefined: (autoScroll: boolean, preserved?: PreservedOptions) => void
}

interface PreservedOptions {
  cursor?: codemirror.Position
}

class Shared implements CommonType {
  private readonly editor: codemirror.Editor

  constructor(editor: codemirror.Editor) {
    this.editor = editor
  }

  delegateCursor(
    position: codemirror.Position,
    scroll?: boolean,
    focus?: boolean
  ) {
    const doc = this.editor.getDoc() as codemirror.Doc

    if (focus) {
      this.editor.focus()
    }

    scroll
      ? doc.setCursor(position)
      : doc.setCursor(position, undefined, { scroll: false })
  }

  delegateScroll(coordinates: SetScrollOptions) {
    this.editor.scrollTo(coordinates.x, coordinates.y)
  }

  delegateSelection(ranges: Array<SetSelectionOptions>, focus?: boolean) {
    const doc = this.editor.getDoc() as codemirror.Doc
    doc.setSelections(ranges)

    if (focus) {
      this.editor.focus()
    }
  }

  public apply(props: ControlledCodeMirror | UnControlledCodeMirror) {
    // init ranges
    if (props && props.selection && props.selection.ranges) {
      this.delegateSelection(
        props.selection.ranges,
        props.selection.focus || false
      )
    }

    // init cursor
    if (props && props.cursor) {
      this.delegateCursor(
        props.cursor,
        props.autoScroll || false,
        this.editor.getOption('autofocus') || false
      )
    }

    // init scroll
    if (props && props.scroll) {
      this.delegateScroll(props.scroll)
    }
  }

  public applyNext(
    props: ControlledCodeMirror | UnControlledCodeMirror,
    next?: ControlledCodeMirror | UnControlledCodeMirror,
    preserved?: any
  ) {
    // handle new ranges
    if (props && props.selection && props.selection.ranges) {
      if (
        next &&
        next.selection &&
        next.selection.ranges &&
        !isEqual(props.selection.ranges, next.selection.ranges)
      ) {
        this.delegateSelection(
          next.selection.ranges,
          next.selection.focus || false
        )
      }
    }

    // handle new cursor
    if (props && props.cursor) {
      if (next && next.cursor && !isEqual(props.cursor, next.cursor)) {
        this.delegateCursor(
          preserved.cursor || next.cursor,
          next.autoScroll || false,
          next.autoCursor || false
        )
      }
    }

    // handle new scroll
    if (props && props.scroll) {
      if (next && next.scroll && !isEqual(props.scroll, next.scroll)) {
        this.delegateScroll(next.scroll)
      }
    }
  }

  public applyUserDefined(autoScroll: boolean, preserved?: any) {
    if (preserved && preserved.cursor) {
      this.delegateCursor(
        preserved.cursor,
        autoScroll || false,
        this.editor.getOption('autofocus') || false
      )
    }
  }

  public wire(props: ControlledCodeMirror | UnControlledCodeMirror) {
    Object.keys(props || {})
      .filter(p => /^on/.test(p))
      .forEach(prop => {
        switch (prop) {
          case 'onBlur':
              this.editor.on('blur', (cm, event) => {
                if (props.onBlur) {
                  props.onBlur(this.editor, event)
                }
              })
            break
          case 'onContextMenu': {
            this.editor.on('contextmenu', (cm, event) => {
              if (props.onContextMenu) {
                props.onContextMenu(this.editor, event)
              }
            })
            break
          }
          case 'onCopy': {
            this.editor.on('copy', (cm, event?) => {
              if (props.onCopy) {
                props.onCopy(this.editor, event)
              }
            })
            break
          }
          case 'onCursor':
              this.editor.on('cursorActivity', () => {
                if (props.onCursor) {
                  props.onCursor(this.editor, this.editor.getDoc().getCursor())
                }
              })
            break
          case 'onCursorActivity':
              this.editor.on('cursorActivity', () => {
                if (props.onCursorActivity) {
                  props.onCursorActivity(this.editor)
                }
              })
            break
          case 'onCut': {
            this.editor.on('cut', (cm, event?) => {
              if (props.onCut) {
                props.onCut(this.editor, event)
              }
            })
            break
          }
          case 'onDblClick': {
            this.editor.on('dblclick', (cm, event) => {
              if (props.onDblClick) {
                props.onDblClick(this.editor, event)
              }
            })
            break
          }
          case 'onDragEnter':
              this.editor.on('dragenter', (cm, event) => {
                if (props.onDragEnter) {
                  props.onDragEnter(this.editor, event)
                }
              })
            break
          case 'onDragLeave': {
            this.editor.on('dragleave', (cm, event) => {
              if (props.onDragLeave) {
                props.onDragLeave(this.editor, event)
              }
            })
            break
          }
          case 'onDragOver':
              this.editor.on('dragover', (cm, event) => {
                if (props.onDragOver) {
                  props.onDragOver(this.editor, event)
                }
              })
            break
          case 'onDragStart': {
            this.editor.on('dragstart', (cm, event) => {
              if (props.onDragStart) {
                props.onDragStart(this.editor, event)
              }
            })
            break
          }
          case 'onDrop':
              this.editor.on('drop', (cm, event) => {
                if (props.onDrop) {
                  props.onDrop(this.editor, event)
                }
              })
            break
          case 'onFocus':
              this.editor.on('focus', (cm, event) => {
                if (props.onFocus) {
                  props.onFocus(this.editor, event)
                }
              })
            break
          case 'onGutterClick':
              this.editor.on('gutterClick', (cm, lineNumber, gutter, event) => {
                if (props.onGutterClick) {
                  props.onGutterClick(this.editor, lineNumber, gutter, event)
                }
              })
            break
          case 'onInputRead':
              this.editor.on('inputRead', (cm, EditorChangeEvent) => {
                if (props.onInputRead) {
                  props.onInputRead(this.editor, EditorChangeEvent)
                }
              })
            break
          case 'onKeyDown':
              this.editor.on('keydown', (cm, event) => {
                if (props.onKeyDown) {
                  props.onKeyDown(this.editor, event)
                }
              })
            break
          case 'onKeyHandled':
              this.editor.on('keyHandled', (cm, key, event) => {
                if (props.onKeyHandled) {
                  props.onKeyHandled(this.editor, key, event)
                }
              })
            break
          case 'onKeyPress':
              this.editor.on('keypress', (cm, event) => {
                if (props.onKeyPress) {
                  props.onKeyPress(this.editor, event)
                }
              })
            break
          case 'onKeyUp':
              this.editor.on('keyup', (cm, event) => {
                if (props.onKeyUp) {
                  props.onKeyUp(this.editor, event)
                }
              })
            break
          case 'onMouseDown': {
            this.editor.on('mousedown', (cm, event) => {
              if (props.onMouseDown) {
                props.onMouseDown(this.editor, event)
              }
            })
            break
          }
          case 'onPaste': {
            this.editor.on('paste', (cm, event?) => {
              if (props.onPaste) {
                props.onPaste(this.editor, event)
              }
            })
            break
          }
          case 'onRenderLine': {
            this.editor.on('renderLine', (cm, line, element) => {
              if (props.onRenderLine) {
                props.onRenderLine(this.editor, line, element)
              }
            })
            break
          }
          case 'onScroll':
              this.editor.on('scroll', cm => {
                if (props.onScroll) {
                  props.onScroll(this.editor, this.editor.getScrollInfo())
                }
              })
            break
          case 'onSelection':
              this.editor.on('beforeSelectionChange', (cm, data) => {
                if (props.onSelection) {
                  props.onSelection(this.editor, data)
                }
              })
            break
          case 'onTouchStart': {
            this.editor.on('touchstart', (cm, event) => {
              if (props.onTouchStart) {
                props.onTouchStart(this.editor, event)
              }
            })
            break
          }
          case 'onUpdate':
              this.editor.on('update', () => {
                if (props.onUpdate) {
                  props.onUpdate(this.editor)
                }
              })
            break
          case 'onViewportChange':
              this.editor.on('viewportChange', (cm, from, to) => {
                if (props.onViewportChange) {
                  props.onViewportChange(this.editor, from, to)
                }
              })
            break
          default: {
            // ...
          }
        }
      })
  }
}

interface ControlledState {
  applied: boolean
  appliedNext: boolean
  appliedUserDefined: boolean
  deferred: any
  editor: codemirror.Editor | null
  emulating: boolean
  hydrated: boolean
  mirror: any
  isMounted: boolean
  ref: HTMLElement | null
  shared: Shared | null
  preserved: PreservedOptions
}

const commonProps = {
  autoCursor: {
    type: Boolean,
    default: true
  },
  autoScroll: {
    type: Boolean,
    default: false
  },
  cursor: {
    type: Object as PropType<codemirror.Position>
  },
  defineMode: {
    type: Object as PropType<DefineModeOptions>
  },
  editorDidConfigure: {
    type: Function as PropType<(editor: codemirror.Editor) => void>
  },
  editorDidMount: {
    type: Function as PropType<
      (editor: codemirror.Editor, value: string, cb: () => void) => void
    >
  },
  editorWillUnmount: {
    type: Function as PropType<(lib: any) => void>
  },
  onBlur: {
    type: Function as PropType<DomEvent>
  },
  onChange: {
    type: Function as PropType<
      (
        editor: codemirror.Editor,
        data: codemirror.EditorChange,
        value: string
      ) => void
    >
  },
  onContextMenu: {
    type: Function as PropType<DomEvent>
  },
  onCopy: {
    type: Function as PropType<DomEvent>
  },
  onCursor: {
    type: Function as PropType<
      (editor: codemirror.Editor, data: codemirror.Position) => void
    >
  },
  onCut: {
    type: Function as PropType<DomEvent>
  },
  onCursorActivity: {
    type: Function as PropType<(editor: codemirror.Editor) => void>
  },
  onDblClick: {
    type: Function as PropType<DomEvent>
  },
  onDragEnter: {
    type: Function as PropType<DomEvent>
  },
  onDragLeave: {
    type: Function as PropType<DomEvent>
  },
  onDragOver: {
    type: Function as PropType<DomEvent>
  },
  onDragStart: {
    type: Function as PropType<DomEvent>
  },
  onDrop: {
    type: Function as PropType<DomEvent>
  },
  onFocus: {
    type: Function as PropType<DomEvent>
  },
  onGutterClick: {
    type: Function as PropType<
      (
        editor: codemirror.Editor,
        lineNumber: number,
        gutter: string,
        event: Event
      ) => void
    >
  },
  onInputRead: {
    type: Function as PropType<EditorChangeEvent>
  },
  onKeyDown: {
    type: Function as PropType<DomEvent>
  },
  onKeyHandled: {
    type: Function as PropType<KeyHandledEvent>
  },
  onKeyPress: {
    type: Function as PropType<DomEvent>
  },
  onKeyUp: {
    type: Function as PropType<DomEvent>
  },
  onMouseDown: {
    type: Function as PropType<DomEvent>
  },
  onPaste: {
    type: Function as PropType<DomEvent>
  },
  onRenderLine: {
    type: Function as PropType<
      (
        editor: codemirror.Editor,
        line: codemirror.LineHandle,
        element: HTMLElement
      ) => void
    >
  },
  onScroll: {
    type: Function as PropType<
      (editor: codemirror.Editor, data: codemirror.ScrollInfo) => void
    >
  },
  onSelection: {
    type: Function as PropType<(editor: codemirror.Editor, data: any) => void>
  },
  onTouchStart: {
    type: Function as PropType<DomEvent>
  },
  onUpdate: {
    type: Function as PropType<(editor: codemirror.Editor) => void>
  },
  onViewportChange: {
    type: Function as PropType<
      (editor: codemirror.Editor, start: number, end: number) => void
    >
  },
  options: {
    type: Object as PropType<codemirror.EditorConfiguration>
  },
  selection: {
    type: Object as PropType<{
      ranges: Array<SetSelectionOptions>
      focus?: boolean
    }>
  },
  scroll: {
    type: Object as PropType<SetScrollOptions>
  }
}

const controlledProps = Object.assign({}, commonProps, {
  onBeforeChange: {
    type: Function as PropType<
      (
        editor: codemirror.Editor,
        data: codemirror.EditorChange,
        value: string
      ) => void
    >
  },
  value: {
    type: String,
    default: ''
  }
})

export const Controlled = defineComponent({
  props: controlledProps,
  emits: ['update:value'],
  data(): ControlledState {
    return {
      applied: false,
      appliedNext: false,
      appliedUserDefined: false,
      deferred: false,
      emulating: false,
      hydrated: false,
      mirror: false,
      isMounted: false,
      editor: null,
      ref: null,
      shared: null,
      preserved: {}
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.hydrated = false
      }
    },
    selection(newVal, oldVal) {
      if (
        !this.appliedNext &&
        newVal &&
        oldVal &&
        newVal.ranges &&
        oldVal.ranges &&
        !isEqual(newVal.ranges, oldVal.ranges)
      ) {
        this.shared?.delegateSelection(newVal.ranges, newVal.focus || false)
      }
    },
    cursor(newVal, oldVal) {
      if (!this.appliedNext && !isEqual(newVal, oldVal)) {
        this.shared?.delegateCursor(
          this.preserved.cursor || newVal,
          this.autoScroll || false,
          this.autoCursor || false
        )
      }
    },
    scroll(newVal, oldVal) {
      if (!this.appliedNext && !isEqual(newVal, oldVal)) {
        this.shared?.delegateScroll(newVal)
      }
    },
    appliedNext(newVal) {
      if (!newVal) {
        this.appliedNext = true
      }
    }
  },
  mounted() {
    if (this.defineMode) {
      if (this.defineMode.name && this.defineMode.fn) {
        codemirror.defineMode(this.defineMode.name, this.defineMode.fn)
      }
    }
    if (!this.ref) {
      return
    }
    this.editor = codemirror(this.ref, this.options) as codemirror.Editor

    this.shared = new Shared(this.editor)

    this.mirror = (codemirror as any)(() => {}, this.options)

    this.editor.on('electricInput', () => {
      this.mirror.setHistory(this.editor?.getDoc().getHistory())
    })

    this.editor.on('cursorActivity', () => {
      this.mirror.setCursor(this.editor?.getDoc().getCursor())
    })

    this.editor.on('beforeChange', (cm, data) => {
      if (this.emulating) {
        return
      }

      data.cancel()

      this.deferred = data

      const phantomChange = this.mirrorChange(this.deferred)

      if (this.onBeforeChange && this.editor)
        this.onBeforeChange(this.editor, this.deferred, phantomChange)
    })

    this.editor.on('change', (cm, data) => {
      if (!this.isMounted) {
        return
      }

      if (this.editor) {
        this.$emit('update:value', this.editor, data, this.editor.getValue())
      }
    })

    this.hydrate(this.options, this.value)

    this.shared.apply(this)

    this.applied = true

    this.isMounted = true

    this.shared.wire(this)

    if (this.editor.getOption('autofocus')) {
      this.editor.focus()
    }

    if (this.editorDidMount) {
      this.editorDidMount(this.editor, this.editor.getValue(), this.initCb)
    }
  },
  updated() {
    if (!this.autoCursor && this.autoCursor !== undefined) {
      this.preserved.cursor = this.editor?.getDoc().getCursor()
    }

    this.hydrate(this.options, this.value)

    this.shared?.applyUserDefined(this.autoScroll, this.preserved)
    this.appliedUserDefined = true
  },
  beforeUnmount() {
    if (this.editorWillUnmount) {
      this.editorWillUnmount(codemirror)
    }
  },
  methods: {
    initCb() {
      if (this.editorDidConfigure && this.editor) {
        this.editorDidConfigure(this.editor)
      }
    },
    hydrate(options: codemirror.EditorConfiguration | void, value: string) {
      const opts = options || {}
      const userDefinedOptions = Object.assign(
        {},
        (this.editor as any).options,
        opts
      )

      const optionDelta = Object.keys(userDefinedOptions).some(
        key => this.editor?.getOption(key as any) !== userDefinedOptions[key]
      )

      if (optionDelta) {
        Object.keys(userDefinedOptions).forEach(key => {
          if (opts.hasOwnProperty(key)) {
            if (
              this.editor?.getOption(key as any) !== userDefinedOptions[key]
            ) {
              this.editor?.setOption(key as any, userDefinedOptions[key])
              this.mirror.setOption(key as any, userDefinedOptions[key])
            }
          }
        })
      }
      if (!this.hydrated) {
        this.deferred ? this.resolveChange(value) : this.initChange(value || '')
      }
      this.hydrated = true
    },
    initChange(value: string) {
      this.emulating = true

      const doc = this.editor?.getDoc()
      if (doc) {
        const lastLine = doc.lastLine()
        const lastChar = doc.getLine(doc.lastLine()).length

        doc.replaceRange(
          value || '',
          { line: 0, ch: 0 },
          { line: lastLine, ch: lastChar }
        )

        this.mirror.setValue(value)
        doc.clearHistory()
        this.mirror.clearHistory()

        this.emulating = false
      }
    },
    resolveChange(value: string) {
      this.emulating = true

      const doc = this.editor?.getDoc()
      if (doc) {
        if (this.deferred.origin === 'undo') {
          doc.undo()
        } else if (this.deferred.origin === 'redo') {
          doc.redo()
        } else {
          doc.replaceRange(
            this.deferred.text,
            this.deferred.from,
            this.deferred.to,
            this.deferred.origin
          )
        }

        if (value && value !== doc.getValue()) {
          const cursor = doc.getCursor()
          doc.setValue(value)
          doc.setCursor(cursor)
        }

        this.emulating = false
        this.deferred = null
      }
    },
    mirrorChange(deferred: any) {
      const doc = this.editor?.getDoc()
      if (deferred.origin === 'undo') {
        doc?.setHistory(this.mirror.getHistory())
        this.mirror.undo()
      } else if (deferred.origin === 'redo') {
        doc?.setHistory(this.mirror.getHistory())
        this.mirror.redo()
      } else {
        this.mirror.replaceRange(
          deferred.text,
          deferred.from,
          deferred.to,
          deferred.origin
        )
      }

      return this.mirror.getValue()
    }
  },
  render() {
    return <div class="react-codemirror2" ref="ref" />
  }
})

interface UnControlledState {
  applied: boolean
  appliedUserDefined: boolean
  continueChange: boolean
  detached: boolean
  editor: codemirror.Editor | null
  hydrated: boolean
  isMounted: boolean
  ref: HTMLElement | null
  shared: Shared | null
}

const unControlledProps = Object.assign({}, commonProps, {
  detach: {
    type: Boolean
  },
  editorDidAttach: {
    type: Function as PropType<(editor: codemirror.Editor) => void>
  },
  editorDidDetach: {
    type: Function as PropType<(editor: codemirror.Editor) => void>
  },
  onBeforeChange: {
    type: Function as PropType<
      (
        editor: codemirror.Editor,
        data: codemirror.EditorChange,
        value: string,
        next: () => void
      ) => void
    >
  },
  value: {
    type: String,
    default: ''
  }
})

export const UnControlled = defineComponent({
  props: unControlledProps,
  emits: ['update:value'],
  data(): UnControlledState {
    return {
      applied: false,
      appliedUserDefined: false,
      continueChange: false,
      detached: false,
      hydrated: false,
      isMounted: false,
      editor: null,
      shared: null,
      ref: null
    }
  },
  mounted() {
    this.detached = this.detach === true

    if (this.defineMode) {
      if (this.defineMode.name && this.defineMode.fn) {
        codemirror.defineMode(this.defineMode.name, this.defineMode.fn)
      }
    }

    if (!this.$refs.ref) {
      return
    }
    this.editor = codemirror(this.$refs.ref as HTMLElement, this.options) as codemirror.Editor

    this.shared = new Shared(this.editor)

    this.editor.on('beforeChange', (cm, data) => {
      if (this.onBeforeChange && this.editor) {
        this.onBeforeChange(
          this.editor,
          data,
          this.editor.getValue(),
          this.onBeforeChangeCb
        )
      }
    })

    this.editor.on('change', (cm, data) => {
      if (!this.isMounted) {
        return
      }

      if (this.onBeforeChange) {
        if (this.continueChange && this.editor) {
          this.$emit('update:value', this.editor, data, this.editor.getValue())
        }
      } else {
        if (this.editor) {
          this.$emit('update:value', this.editor, data, this.editor.getValue())
        }
      }
    })

    this.hydrate(this.options, this.value)

    this.shared.apply(this)

    this.applied = true

    this.isMounted = true

    this.shared.wire(this)

    this.editor.getDoc().clearHistory()

    if (this.editorDidMount) {
      this.editorDidMount(this.editor, this.editor.getValue(), this.initCb)
    }
  },
  beforeUnmount() {
    if (this.editorWillUnmount) {
      this.editorWillUnmount(codemirror)
    }
  },
  methods: {
    initCb() {
      if (this.editorDidConfigure && this.editor) {
        this.editorDidConfigure(this.editor)
      }
    },
    onBeforeChangeCb() {
      this.continueChange = true
    },
    hydrate(options: codemirror.EditorConfiguration | void, value: string) {
      const opts = options || {}
      const userDefinedOptions = Object.assign(
        {},
        (this.editor as any).options,
        opts
      )
      const optionDelta = Object.keys(userDefinedOptions).some(
        key => this.editor?.getOption(key as any) !== userDefinedOptions[key]
      )

      if (optionDelta) {
        Object.keys(userDefinedOptions).forEach(key => {
          if (opts.hasOwnProperty(key)) {
            if (
              this.editor?.getOption(key as any) !== userDefinedOptions[key]
            ) {
              this.editor?.setOption(key as any, userDefinedOptions[key])
            }
          }
        })
      }

      if (!this.hydrated && this.editor) {
        const doc = this.editor.getDoc()
        if (doc) {
          const lastLine = doc.lastLine()
          const lastChar = doc.getLine(doc.lastLine()).length

          doc.replaceRange(
            value || '',
            { line: 0, ch: 0 },
            { line: lastLine, ch: lastChar }
          )
        }
      }

      this.hydrated = true
    }
  },
  render() {
    return <div class="react-codemirror2" ref="ref" />
  }
})
