import {
  HotkeyOptions,
  RenderBlockFunction,
  usePortableTextEditor,
  usePortableTextEditorSelection,
} from '@sanity/portable-text-editor'
import classNames from 'classnames'
import React, {useMemo} from 'react'
import {Path} from '@sanity/types'
import ActionMenu from './ActionMenu'
import BlockStyleSelect from './BlockStyleSelect'
import InsertMenu from './InsertMenu'
import {getBlockStyleSelectProps, getInsertMenuItems, getPTEToolbarActionGroups} from './helpers'

import styles from './Toolbar.css'

const preventDefault = (event) => event.preventDefault()
interface Props {
  hotkeys: HotkeyOptions
  isFullscreen: boolean
  readOnly: boolean
  renderBlock: RenderBlockFunction
  onFocus: (path: Path) => void
}

function PTEToolbar(props: Props) {
  const {hotkeys, isFullscreen, readOnly, onFocus, renderBlock} = props
  const editor = usePortableTextEditor()
  const selection = usePortableTextEditorSelection()
  const disabled = !selection
  const actionGroups = useMemo(
    () => (editor ? getPTEToolbarActionGroups(editor, selection, onFocus, hotkeys) : []),
    [editor, selection, onFocus, hotkeys]
  )
  const actionsLen = useMemo(() => actionGroups.reduce((acc, x) => acc + x.actions.length, 0), [
    actionGroups,
  ])
  const blockStyleSelectProps = useMemo(
    () => (editor && selection ? getBlockStyleSelectProps(editor) : null),
    [editor, selection]
  )
  const insertMenuItems = useMemo(
    () => (editor ? getInsertMenuItems(editor, selection, onFocus) : []),
    [editor, onFocus, selection]
  )

  return (
    <div
      className={classNames(styles.root, isFullscreen && styles.fullscreen)}
      // Ensure the editor doesn't lose focus when interacting
      // with the toolbar (prevent focus click events)
      onMouseDown={preventDefault}
      onKeyPress={preventDefault}
    >
      {blockStyleSelectProps && blockStyleSelectProps.items.length > 1 && (
        <div className={styles.blockStyleSelectContainer}>
          <BlockStyleSelect
            {...blockStyleSelectProps}
            className={styles.blockStyleSelect}
            disabled={disabled}
            padding="small"
            readOnly={readOnly}
            renderBlock={renderBlock}
          />
        </div>
      )}
      {actionsLen > 0 && (
        <div className={styles.actionMenuContainer}>
          <ActionMenu disabled={disabled} groups={actionGroups} readOnly={readOnly} />
        </div>
      )}
      {insertMenuItems.length > 0 && (
        <div className={styles.insertMenuContainer}>
          <InsertMenu disabled={disabled} items={insertMenuItems} readOnly={readOnly} />
        </div>
      )}
    </div>
  )
}

export default PTEToolbar
