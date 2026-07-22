'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getQuizForStudent, getStudentAttempts, submitQuizAttempt } from '@/app/actions/quizzes'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, ChevronRight, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

interface Quiz {
  id: string
  title: string
  description?: string | null
  timeLimit?: number | null
  maxAttempts?: number | null
  isPublished: boolean
  questions: Question[]
}

interface Question {
  id: string
  quizId: string
  questionText: string
  questionType: string
  options: string
  points: number
  orderIndex: number
}

interface QuizResult {
  score: number
  totalPoints: number
  questions: (Question & { correctAnswer: string })[]
  answers: string
}

export default function TakeQuizPage() {
  const params = useParams()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [started, setStarted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [attemptCount, setAttemptCount] = useState(0)

  useEffect(() => {
    if (params.id) {
      Promise.all([
        getQuizForStudent(params.id as string),
        getStudentAttempts(params.id as string),
      ])
        .then(([quizData, attempts]) => {
          if (quizData) {
            setQuiz(quizData)
            setAttemptCount(attempts?.length || 0)
            if (quizData.timeLimit) {
              setTimeLeft(quizData.timeLimit * 60)
            }
          } else {
            setError('Không tìm thấy bài kiểm tra')
          }
        })
        .catch((err) => {
          console.error('Error:', err)
          setError('Lỗi khi tải bài kiểm tra')
        })
        .finally(() => setLoading(false))
    }
  }, [params.id])

  useEffect(() => {
    if (!started || timeLeft === null || result) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [started, timeLeft, result])

  const handleStart = () => {
    setStarted(true)
    setCurrentQuestion(0)
  }

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = useCallback(async () => {
    if (submitting || result || !quiz) return
    setSubmitting(true)
    try {
      const res = await submitQuizAttempt(quiz.id, answers)
      setResult(res)
    } catch (error) {
      alert('Lỗi khi nộp bài')
    } finally {
      setSubmitting(false)
    }
  }, [submitting, result, quiz, answers])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-red-700 font-bold text-xl">NT</span>
              </div>
              <div>
                <p className="text-xs opacity-80 tracking-wider uppercase">Cổng thông tin điện tử</p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-wide">TRƯỜNG THCS NGUYỄN TRÃI</h1>
              </div>
            </Link>
          </div>
        </header>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded" />)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-red-700 font-bold text-xl">NT</span>
              </div>
              <div>
                <p className="text-xs opacity-80 tracking-wider uppercase">Cổng thông tin điện tử</p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-wide">TRƯỜNG THCS NGUYỄN TRÃI</h1>
              </div>
            </Link>
          </div>
        </header>
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <p className="text-gray-500 mb-4">{error || 'Không tìm thấy bài kiểm tra'}</p>
            <Link href="/quizzes" className="text-red-600 hover:text-red-700 inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay về danh sách
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show results
  if (result) {
    const percentage = result.totalPoints > 0 ? Math.round((result.score / result.totalPoints) * 100) : 0
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-red-700 font-bold text-xl">NT</span>
              </div>
              <div>
                <p className="text-xs opacity-80 tracking-wider uppercase">Cổng thông tin điện tử</p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-wide">TRƯỜNG THCS NGUYỄN TRÃI</h1>
              </div>
            </Link>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Kết quả bài kiểm tra</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{result.score}</p>
                <p className="text-sm text-gray-500">Điểm đạt được</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-600">{result.totalPoints}</p>
                <p className="text-sm text-gray-500">Tổng điểm</p>
              </div>
              <div className={`p-4 rounded-lg ${percentage >= 50 ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className={`text-3xl font-bold ${percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>{percentage}%</p>
                <p className="text-sm text-gray-500">Tỷ lệ</p>
              </div>
            </div>
          </div>

          {/* Review answers */}
          <div className="space-y-4">
            {result.questions.map((q, i) => {
              let options: string[] = []
              try { options = JSON.parse(q.options) } catch {}
              const userAnswer = JSON.parse(result.answers || '{}')[q.id]
              const isCorrect = q.questionType === 'fill_in'
                ? userAnswer?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()
                : userAnswer === q.correctAnswer

              return (
                <div key={q.id} className={`bg-white rounded-lg border p-4 ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                      {isCorrect ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">Câu {i + 1}: {q.questionText}</p>
                      {q.questionType !== 'fill_in' ? (
                        <div className="space-y-1">
                          {options.map((opt, j) => (
                            <div
                              key={j}
                              className={`text-sm px-3 py-1.5 rounded ${
                                String(j) === q.correctAnswer
                                  ? 'bg-green-100 text-green-700 font-medium'
                                  : String(j) === userAnswer
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-50 text-gray-600'
                              }`}
                            >
                              {String.fromCharCode(65 + j)}. {opt}
                              {String(j) === q.correctAnswer && ' ✓'}
                              {String(j) === userAnswer && String(j) !== q.correctAnswer && ' ✗'}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm space-y-1">
                          <p className="text-gray-600">Câu trả lời của bạn: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{userAnswer || '(chưa trả lời)'}</span></p>
                          {!isCorrect && <p className="text-green-600">Đáp án đúng: {q.correctAnswer}</p>}
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">{q.points} điểm</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 text-center">
            <Link href="/quizzes">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Quay về danh sách
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Start screen
  if (!started) {
    const maxAttempts = quiz.maxAttempts || 1
    const attemptsLeft = maxAttempts - attemptCount
    const hasAttemptsLeft = attemptsLeft > 0

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-red-700 font-bold text-xl">NT</span>
              </div>
              <div>
                <p className="text-xs opacity-80 tracking-wider uppercase">Cổng thông tin điện tử</p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-wide">TRƯỜNG THCS NGUYỄN TRÃI</h1>
              </div>
            </Link>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h2>
            {quiz.description && <p className="text-gray-500 mb-4">{quiz.description}</p>}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-6">
              <span>{quiz.questions.length} câu hỏi</span>
              {quiz.timeLimit && <span>Thời gian: {quiz.timeLimit} phút</span>}
              <span>Đã làm: {attemptCount}/{maxAttempts} lần</span>
            </div>

            {!hasAttemptsLeft ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700">
                Bạn đã hết số lần làm bài cho phép ({maxAttempts} lần).
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm text-yellow-700">
                Lưu ý: Sau khi bắt đầu, bạn cần hoàn thành bài kiểm tra trong thời gian quy định.
                <br />Số lần còn lại: {attemptsLeft}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={handleStart} disabled={!hasAttemptsLeft} className="bg-purple-600 hover:bg-purple-700 px-8">
                Bắt đầu làm bài
              </Button>
              <Link href="/quizzes">
                <Button variant="outline">Quay lại</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Taking quiz
  const questions = quiz.questions
  const q = questions[currentQuestion]
  let options: string[] = []
  try { options = JSON.parse(q.options) } catch {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with timer */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-sm text-gray-500">Câu {currentQuestion + 1}/{questions.length}</p>
          </div>
          {timeLeft !== null && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <span className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
              {currentQuestion + 1}
            </span>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-lg">{q.questionText}</p>
              <p className="text-sm text-gray-500 mt-1">{q.points} điểm</p>
            </div>
          </div>

          {q.questionType !== 'fill_in' ? (
            <div className="space-y-2 ml-11">
              {options.map((opt, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    answers[q.id] === String(i)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === String(i)}
                    onChange={() => handleAnswer(q.id, String(i))}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {q.questionType === 'true_false' ? opt : `${String.fromCharCode(65 + i)}. ${opt}`}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <div className="ml-11">
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswer(q.id, e.target.value)}
                placeholder="Nhập đáp án..."
                className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Câu trước
          </Button>

          <div className="flex items-center gap-2">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestion(i)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                  i === currentQuestion
                    ? 'bg-purple-600 text-white'
                    : answers[questions[i].id]
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? 'Đang nộp...' : 'Nộp bài'}
            </Button>
          ) : (
            <Button onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}>
              Câu tiếp
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
