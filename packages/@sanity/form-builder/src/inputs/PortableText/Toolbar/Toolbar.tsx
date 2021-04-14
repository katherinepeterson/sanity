import {
  HotkeyOptions,
  RenderBlockFunction,
  usePortableTextEditor,
  usePortableTextEditorSelection,
} from '@sanity/portable-text-editor'
import React, {useMemo} from 'react'
import {Path} from '@sanity/types'
import {Box, Card, Flex, Stack} from '@sanity/ui'
import ActionMenu from './ActionMenu'
import InsertMenu from './InsertMenu'
import {getBlockStyleSelectProps, getInsertMenuItems, getPTEToolbarActionGroups} from './helpers'
import {BlockStyleMenu} from './BlockStyleMenu'

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
    <Card
      // Ensure the editor doesn't lose focus when interacting
      // with the toolbar (prevent focus click events)
      onMouseDown={preventDefault}
      onKeyPress={preventDefault}
      style={{lineHeight: 0}}
    >
      <Flex wrap="nowrap">
        {blockStyleSelectProps && blockStyleSelectProps.items.length > 1 && (
          <Stack padding={isFullscreen ? 2 : 1} style={{minWidth: '8em', whiteSpace: 'nowrap'}}>
            <BlockStyleMenu
              disabled={disabled}
              items={blockStyleSelectProps.items}
              readOnly={readOnly}
              renderBlock={renderBlock}
              value={blockStyleSelectProps.value}
            />
          </Stack>
        )}

        {actionsLen > 0 && (
          <Box
            flex={1}
            padding={isFullscreen ? 2 : 1}
            style={{borderLeft: '1px solid var(--card-border-color)'}}
          >
            <ActionMenu disabled={disabled} groups={actionGroups} readOnly={readOnly} />
          </Box>
        )}

        {insertMenuItems.length > 0 && (
          <Box
            padding={isFullscreen ? 2 : 1}
            style={{borderLeft: '1px solid var(--card-border-color)'}}
          >
            <InsertMenu disabled={disabled} items={insertMenuItems} readOnly={readOnly} />
          </Box>
        )}
      </Flex>
    </Card>
  )
}

export default PTEToolbar
