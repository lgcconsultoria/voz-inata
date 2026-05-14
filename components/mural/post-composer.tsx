"use client"

import { useEffect, useRef, useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { MEMBER_POST_TYPES, POST_TYPE_LABEL, type PostType } from "@/lib/mural/post-types"
import { createPostAction, type CreatePostState } from "@/app/mural/actions"

const MAX = 1500

export function PostComposer() {
  const [state, formAction] = useFormState<CreatePostState, FormData>(
    createPostAction,
    {}
  )
  const [selected, setSelected] = useState<PostType>("intencao")
  const [content, setContent] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.ok) {
      setContent("")
      setSelected("intencao")
      formRef.current?.reset()
    }
  }, [state])

  return (
    <Card>
      <CardTitle>Publicar no mural</CardTitle>
      <p className="mt-1 text-sm text-argila">
        Escolha o tipo da sua publicação e diga o que está pensando.
      </p>

      <form ref={formRef} action={formAction} className="mt-5 space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-argila">
            Tipo
          </p>
          <div className="flex flex-wrap gap-2">
            {MEMBER_POST_TYPES.map(t => {
              const active = t === selected
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelected(t)}
                  aria-pressed={active}
                  className={
                    "rounded-full border px-3 py-1.5 text-sm transition-colors " +
                    (active
                      ? "border-lilas-500 bg-lilas-500 text-white"
                      : "border-lilas-100 bg-white text-tinta hover:border-lilas-300")
                  }
                >
                  {POST_TYPE_LABEL[t]}
                </button>
              )
            })}
          </div>
          <input type="hidden" name="post_type" value={selected} />
        </div>

        <div>
          <textarea
            name="content"
            value={content}
            onChange={e => setContent(e.target.value.slice(0, MAX))}
            placeholder="O que você quer compartilhar?"
            rows={4}
            className="w-full resize-none rounded-lg border border-areia bg-white p-3 text-sm placeholder:text-argila/70 focus:border-terracota focus:outline-none focus:ring-2 focus:ring-terracota/30"
            required
          />
          <div className="mt-1 flex items-center justify-between text-xs text-argila">
            <span aria-live="polite">{content.length}/{MAX}</span>
            {state.error && (
              <span className="text-vinho">{state.error}</span>
            )}
            {state.ok && (
              <span className="text-menta-600 font-medium">Publicado.</span>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <SubmitButton disabled={content.trim().length === 0} />
        </div>
      </form>
    </Card>
  )
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="md" disabled={disabled || pending}>
      {pending ? "Publicando…" : "Publicar"}
    </Button>
  )
}
