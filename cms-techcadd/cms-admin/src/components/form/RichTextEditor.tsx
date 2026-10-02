import { useCallback, useEffect, useState } from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '../../lib/cn'
import { controlBorder, useFieldContext } from './field'
import { MediaPicker } from '../media/MediaPicker'
import { assetUrl } from '../../api/client'
import type { MediaRef } from '../../types'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  invalid?: boolean
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something…',
  invalid,
  className,
}: RichTextEditorProps) {
  const field = useFieldContext()
  const isInvalid = invalid ?? field?.invalid ?? false
  const [imagePickerOpen, setImagePickerOpen] = useState(false)

  const editor = useEditor({
    // StarterKit v3 already ships Link and Underline — registering the separate
    // extensions here would double-register and warn.
    extensions: [StarterKit.configure({ link: { openOnClick: false } }), Image],
    content: value,
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
    editorProps: {
      attributes: {
        class:
          'prose-editor min-h-56 max-w-none px-3 py-2.5 text-sm text-slate-900 focus:outline-none',
        'aria-describedby': field?.describedBy ?? '',
        'data-placeholder': placeholder,
      },
    },
  })

  /*
   * `useEditor`'s `content` option only seeds the document on mount — Tiptap
   * never looks at it again. Every editor on this form mounts before its
   * record has loaded (the form starts on `emptyPage()`/`emptyCourse()`
   * defaults while the fetch is in flight), so the field renders empty even
   * once `value` arrives with the saved HTML. Push external changes into the
   * live document explicitly; the equality check stops this from fighting
   * the user's own typing, which already reaches `value` through `onUpdate`.
   */
  useEffect(() => {
    /*
      `isDestroyed` as well as the null check.

      Tiptap tears the editor down on unmount but the object survives — its
      schema and view are set to null while the reference this effect closed
      over stays truthy. Calling getHTML() on that reaches
      DOMSerializer.fromSchema(null) and throws "Cannot read properties of null
      (reading 'cached')", which surfaces as a blank screen with a router error
      rather than anything pointing at the editor.

      It fires whenever a form unmounts while a value is still settling — a
      remount under StrictMode, or navigating away from a course before its
      record has finished loading.
    */
    if (!editor || editor.isDestroyed) return
    if (value === editor.getHTML()) return
    editor.commands.setContent(value, { emitUpdate: false })
  }, [value, editor])

  const setLink = useCallback(() => {
    if (!editor || editor.isDestroyed) return

    const previous: string = editor.getAttributes('link').href ?? ''
    const url = window.prompt('Link URL', previous)
    if (url === null) return

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const insertImage = useCallback(
    (items: MediaRef[]) => {
      if (!editor || editor.isDestroyed) return
      for (const item of items) {
        const src = assetUrl(item.url) ?? item.url
        editor.chain().focus().setImage({ src, alt: item.alt }).run()
      }
    },
    [editor],
  )

  if (!editor) return null

  return (
    <div
      className={cn('overflow-hidden rounded-lg border bg-white', controlBorder(isInvalid), className)}
    >
      <div
        role="toolbar"
        aria-label="Text formatting"
        aria-controls={field?.id}
        className="flex flex-wrap items-center gap-0.5 border-b border-slate-100 bg-slate-50/70 px-1.5 py-1"
      >
        <ToolbarButton
          editor={editor}
          icon={Bold}
          label="Bold"
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          editor={editor}
          icon={Italic}
          label="Italic"
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          editor={editor}
          icon={UnderlineIcon}
          label="Underline"
          isActive={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          editor={editor}
          icon={Strikethrough}
          label="Strikethrough"
          isActive={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />

        <Divider />

        <ToolbarButton
          editor={editor}
          icon={Heading2}
          label="Heading 2"
          isActive={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          editor={editor}
          icon={Heading3}
          label="Heading 3"
          isActive={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />

        <Divider />

        <ToolbarButton
          editor={editor}
          icon={List}
          label="Bullet list"
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          editor={editor}
          icon={ListOrdered}
          label="Numbered list"
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          editor={editor}
          icon={Quote}
          label="Quote"
          isActive={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          editor={editor}
          icon={Code}
          label="Code"
          isActive={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        />
        <ToolbarButton
          editor={editor}
          icon={Minus}
          label="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />

        <Divider />

        <ToolbarButton
          editor={editor}
          icon={ImagePlus}
          label="Insert image"
          onClick={() => setImagePickerOpen(true)}
        />
        <ToolbarButton
          editor={editor}
          icon={Link2}
          label="Add link"
          isActive={editor.isActive('link')}
          onClick={setLink}
        />
        <ToolbarButton
          editor={editor}
          icon={Link2Off}
          label="Remove link"
          disabled={!editor.isActive('link')}
          onClick={() => editor.chain().focus().unsetLink().run()}
        />

        <Divider />

        <ToolbarButton
          editor={editor}
          icon={RemoveFormatting}
          label="Clear formatting"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        />
        <ToolbarButton
          editor={editor}
          icon={Undo2}
          label="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolbarButton
          editor={editor}
          icon={Redo2}
          label="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </div>

      <EditorContent editor={editor} />

      <MediaPicker
        open={imagePickerOpen}
        onOpenChange={setImagePickerOpen}
        onSelect={insertImage}
        multiple
      />
    </div>
  )
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden="true" />
}

interface ToolbarButtonProps {
  editor: Editor
  icon: LucideIcon
  label: string
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
}

function ToolbarButton({ icon: Icon, label, onClick, isActive, disabled }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={isActive}
      title={label}
      className={cn(
        'rounded-md p-1.5 transition-colors disabled:pointer-events-none disabled:opacity-40',
        isActive
          ? 'bg-primary-100 text-primary-700'
          : 'text-slate-500 hover:bg-slate-200/70 hover:text-slate-900',
      )}
    >
      <Icon size={15} aria-hidden="true" />
    </button>
  )
}
