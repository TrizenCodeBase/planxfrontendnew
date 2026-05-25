import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePlanXStore } from '@/store/PlanXStore'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'

interface IssueCommentsProps {
  issueId: string
}

export function IssueComments({ issueId }: IssueCommentsProps) {
  const { user } = useAuth()
  const { tasks, addTaskComment } = usePlanXStore()
  const issue = tasks.find((t) => t.id === issueId)
  const [comment, setComment] = useState('')

  if (!issue) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !user) return
    addTaskComment(issue.id, {
      authorId: user.id,
      authorName: user.name,
      content: comment.trim(),
      createdAt: new Date().toISOString(),
    })
    setComment('')
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">Comments</h3>
      <ul className="mb-4">
        {issue.comments.length === 0 && (
          <li className="text-sm text-[var(--color-text-muted)] py-2">No comments yet.</li>
        )}
        {issue.comments.map((c) => (
          <li
            key={c.id}
            className="py-3 border-b border-[var(--color-border)] last:border-b-0"
          >
            <p className="text-sm font-medium text-[var(--color-text)]">{c.authorName}</p>
            <p className="text-sm text-[var(--color-text)] mt-0.5">{c.content}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {new Date(c.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          label="Add comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
        />
        <Button type="submit" size="sm">
          Post comment
        </Button>
      </form>
    </div>
  )
}
