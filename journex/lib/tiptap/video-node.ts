import { Node, mergeAttributes } from '@tiptap/core'

export interface VideoOptions {
  HTMLAttributes: Record<string, string>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { src: string }) => ReturnType
    }
  }
}

export const Video = Node.create<VideoOptions>({
  name: 'video',
  group: 'block',
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      src: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'video' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'video',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        controls: 'true',
        style: 'width: 100%; max-height: 400px; border-radius: 12px; margin: 8px 0;',
      }),
    ]
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})
