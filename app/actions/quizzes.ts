'use server'

import { db } from '@/lib/db'
import { quizzes, quizQuestions, quizAttempts } from '@/lib/db/schema'
import { desc, eq, count } from 'drizzle-orm'
import { requireAuth } from '@/lib/auth-helpers'

export async function getPublishedQuizzes() {
  return db
    .select({
      id: quizzes.id,
      title: quizzes.title,
      description: quizzes.description,
      timeLimit: quizzes.timeLimit,
      maxAttempts: quizzes.maxAttempts,
      isPublished: quizzes.isPublished,
      createdAt: quizzes.createdAt,
      questionCount: count(quizQuestions.id),
    })
    .from(quizzes)
    .leftJoin(quizQuestions, eq(quizzes.id, quizQuestions.quizId))
    .where(eq(quizzes.isPublished, true))
    .groupBy(quizzes.id)
    .orderBy(desc(quizzes.createdAt))
}

export async function getQuizForStudent(id: string) {
  const quiz = await db.select().from(quizzes).where(eq(quizzes.id, id)).limit(1)
  if (!quiz[0] || !quiz[0].isPublished) return null

  const questions = await db
    .select({
      id: quizQuestions.id,
      quizId: quizQuestions.quizId,
      questionText: quizQuestions.questionText,
      questionType: quizQuestions.questionType,
      options: quizQuestions.options,
      points: quizQuestions.points,
      orderIndex: quizQuestions.orderIndex,
    })
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, id))
    .orderBy(quizQuestions.orderIndex)

  return { ...quiz[0], questions }
}

export async function getStudentAttempts(quizId: string) {
  const currentUser = await requireAuth()
  return db
    .select()
    .from(quizAttempts)
    .where(eq(quizAttempts.quizId, quizId))
    .orderBy(desc(quizAttempts.startedAt))
}

export async function submitQuizAttempt(quizId: string, answers: Record<string, string>) {
  const currentUser = await requireAuth()

  const quiz = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1)
  if (!quiz[0]) throw new Error('Quiz not found')

  const questions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, quizId))
    .orderBy(quizQuestions.orderIndex)

  let score = 0
  let totalPoints = 0

  for (const q of questions) {
    totalPoints += q.points
    const userAnswer = answers[q.id]
    if (q.questionType === 'fill_in') {
      if (userAnswer?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
        score += q.points
      }
    } else {
      if (userAnswer === q.correctAnswer) {
        score += q.points
      }
    }
  }

  const result = await db
    .insert(quizAttempts)
    .values({
      id: crypto.randomUUID(),
      quizId,
      studentId: currentUser.id,
      score,
      totalPoints,
      answers: JSON.stringify(answers),
      startedAt: new Date(),
      completedAt: new Date(),
    })
    .returning()

  return { ...result[0], questions }
}
