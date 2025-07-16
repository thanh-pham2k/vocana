import React, { useState } from 'react';
import styles from '@/styles/AdminPage.module.scss';
import Sidebar from '../../../src/components/Sidebar';
import MCQQuestionForm from '../../../src/components/admin/exam/MCQQuestionForm';
import ReadingQuestionForm from '../../../src/components/admin/exam/ReadingQuestionForm';
import ListeningQuestionForm from '../../../src/components/admin/exam/ListeningQuestionForm';
import FillInTheBlankQuestionForm from '../../../src/components/admin/exam/FillInTheBlankQuestionForm';
import { useRouter } from 'next/router';
import * as XLSX from 'xlsx';

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correct: string;
  answerExplanation?: string;
}

interface ReadingQuestion {
  id: string;
  passage: string;
  image?: string;
  mcqs: MCQQuestion[];
}

interface ListeningQuestion {
  id: string;
  audioFile: string;
  mcqs: MCQQuestion[];
  answerExplanation?: string;
}

interface FillInTheBlankAnswer {
  id: string;
  answer: string;
}

interface FillInTheBlankQuestion {
  id: string;
  question: string;
  answers: FillInTheBlankAnswer[];
  answerExplanation?: string;
}

const navItems = [
  { label: 'Courses', path: '/admin/courses' },
  { label: 'Students', path: '/admin' },
  { label: 'Exams', path: '/admin/exams' },
];
const questionTypes = [
  { label: 'Multiple Choice (MCQ)', value: 'mcq' },
  { label: 'Reading Comprehension', value: 'reading' },
  { label: 'Listening Comprehension', value: 'listening' },
  { label: 'Fill-in-the-Blank', value: 'fill_in_the_blank' },
];

export default function CreateExamPage() {
  const [activeType, setActiveType] = useState('mcq');
  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>([
    { id: Date.now().toString(), question: '', options: ['', '', '', ''], correct: '' },
  ]);
  const [readingQuestions, setReadingQuestions] = useState<ReadingQuestion[]>([
    { id: Date.now().toString(), passage: '', mcqs: [{ id: Date.now().toString() + '-mcq', question: '', options: ['', '', '', ''], correct: '' }] },
  ]);
  const [listeningQuestions, setListeningQuestions] = useState<ListeningQuestion[]>([
    { id: Date.now().toString(), audioFile: '', mcqs: [{ id: Date.now().toString() + '-mcq', question: '', options: ['', '', '', ''], correct: '' }] },
  ]);
  const [fillInTheBlankQuestions, setFillInTheBlankQuestions] = useState<FillInTheBlankQuestion[]>([
    { id: Date.now().toString(), question: '', answers: [{ id: Date.now().toString() + '-answer', answer: '' }] },
  ]);
  const router = useRouter();

  const addMcqQuestion = () => {
    setMcqQuestions([
      ...mcqQuestions,
      { id: Date.now().toString(), question: '', options: ['', '', '', ''], correct: '' },
    ]);
  };

  const handleMcqChange = (
    id: string,
    field: keyof MCQQuestion,
    value: string | string[],
    optionIndex?: number
  ) => {
    setMcqQuestions(prevQuestions =>
      prevQuestions.map(q => {
        if (q.id === id) {
          if (field === 'options' && optionIndex !== undefined) {
            const newOptions = [...(q.options as string[])];
            newOptions[optionIndex] = value as string;
            return { ...q, options: newOptions };
          }
          return { ...q, [field]: value };
        }
        return q;
      })
    );
  };

  const deleteMcqQuestion = (id: string) => {
    setMcqQuestions(prevQuestions => prevQuestions.filter(q => q.id !== id));
  };

  const addReadingQuestion = () => {
    setReadingQuestions(prevReading => [
      ...prevReading,
      { id: Date.now().toString(), passage: '', mcqs: [{ id: Date.now().toString() + '-mcq', question: '', options: ['', '', '', ''], correct: '' }] },
    ]);
  };

  const deleteReadingQuestion = (id: string) => {
    setReadingQuestions(prevReading => prevReading.filter(rq => rq.id !== id));
  };

  const addReadingMcq = (readingId: string) => {
    setReadingQuestions(prevReading =>
      prevReading.map(rq =>
        rq.id === readingId
          ? { ...rq, mcqs: [...rq.mcqs, { id: Date.now().toString() + '-mcq', question: '', options: ['', '', '', ''], correct: '' }] }
          : rq
      )
    );
  };

  const deleteReadingMcq = (readingId: string, mcqId: string) => {
    setReadingQuestions(prevReading =>
      prevReading.map(rq =>
        rq.id === readingId
          ? { ...rq, mcqs: rq.mcqs.filter(mcq => mcq.id !== mcqId) }
          : rq
      )
    );
  };

  const handleReadingChange = (
    readingId: string,
    field: keyof ReadingQuestion,
    value: string | string[],
  ) => {
    setReadingQuestions(prevReading =>
      prevReading.map(rq => {
        if (rq.id === readingId) {
          return { ...rq, [field]: value };
        }
        return rq;
      })
    );
  };

  const addListeningQuestion = () => {
    setListeningQuestions(prevListening => [
      ...prevListening,
      { id: Date.now().toString(), audioFile: '', mcqs: [{ id: Date.now().toString() + '-mcq', question: '', options: ['', '', '', ''], correct: '' }] },
    ]);
  };

  const deleteListeningQuestion = (id: string) => {
    setListeningQuestions(prevListening => prevListening.filter(lq => lq.id !== id));
  };

  const addListeningMcq = (listeningId: string) => {
    setListeningQuestions(prevListening =>
      prevListening.map(lq =>
        lq.id === listeningId
          ? { ...lq, mcqs: [...lq.mcqs, { id: Date.now().toString() + '-mcq', question: '', options: ['', '', '', ''], correct: '' }] }
          : lq
      )
    );
  };

  const deleteListeningMcq = (listeningId: string, mcqId: string) => {
    setListeningQuestions(prevListening =>
      prevListening.map(lq =>
        lq.id === listeningId
          ? { ...lq, mcqs: lq.mcqs.filter(mcq => mcq.id !== mcqId) }
          : lq
      )
    );
  };

  const addFillInTheBlankQuestion = () => {
    setFillInTheBlankQuestions(prevQuestions => [
      ...prevQuestions,
      { id: Date.now().toString(), question: '', answers: [{ id: Date.now().toString() + '-answer', answer: '' }] },
    ]);
  };

  const deleteFillInTheBlankQuestion = (id: string) => {
    setFillInTheBlankQuestions(prevQuestions => prevQuestions.filter(q => q.id !== id));
  };

  const handleFillInTheBlankChange = (
    id: string,
    field: keyof FillInTheBlankQuestion | 'answer',
    value: string | FillInTheBlankAnswer[],
    answerIndex?: number
  ) => {
    setFillInTheBlankQuestions(prevQuestions =>
      prevQuestions.map(q => {
        if (q.id === id) {
          if (field === 'answers' && answerIndex !== undefined) {
            const newAnswers = [...(q.answers as FillInTheBlankAnswer[])];
            newAnswers[answerIndex] = { ...newAnswers[answerIndex], answer: value as string };
            return { ...q, answers: newAnswers };
          } else if (field === 'answerExplanation' && typeof value === 'string') {
            return { ...q, answerExplanation: value };
          } else if (field === 'question' && typeof value === 'string') {
            return { ...q, question: value };
          }
          return { ...q, [field]: value };
        }
        return q;
      })
    );
  };

  const addFillInTheBlankAnswer = (questionId: string) => {
    setFillInTheBlankQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q.id === questionId ? { ...q, answers: [...q.answers, { id: Date.now().toString() + '-answer', answer: '' }] } : q
      )
    );
  };

  const deleteFillInTheBlankAnswer = (questionId: string, answerIndex: number) => {
    setFillInTheBlankQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q.id === questionId
          ? { ...q, answers: q.answers.filter((_, idx) => idx !== answerIndex) }
          : q
      )
    );
  };

  const handleListeningChange = (
    listeningId: string,
    field: keyof ListeningQuestion,
    value: string | string[],
  ) => {
    setListeningQuestions(prevListening =>
      prevListening.map(lq => {
        if (lq.id === listeningId) {
          return { ...lq, [field]: value as string };
        }
        return lq;
      })
    );
  };

  const handleReadingMcqUpdate = (
    readingId: string,
    mcqId: string,
    field: keyof MCQQuestion,
    value: string | string[],
    optionIndex?: number
  ) => {
    setReadingQuestions(prevReading =>
      prevReading.map(rq => {
        if (rq.id === readingId) {
          const newMcqs = rq.mcqs.map(mcq => {
            if (mcq.id === mcqId) {
              if (field === 'options' && optionIndex !== undefined) {
                const newOptions = [...(mcq.options as string[])];
                newOptions[optionIndex] = value as string;
                return { ...mcq, options: newOptions };
              }
              return { ...mcq, [field]: value };
            }
            return mcq;
          });
          return { ...rq, mcqs: newMcqs };
        }
        return rq;
      })
    );
  };

  const handleListeningMcqUpdate = (
    listeningId: string,
    mcqId: string,
    field: keyof MCQQuestion,
    value: string | string[],
    optionIndex?: number
  ) => {
    setListeningQuestions(prevListening =>
      prevListening.map(lq => {
        if (lq.id === listeningId) {
          const newMcqs = lq.mcqs.map(mcq => {
            if (mcq.id === mcqId) {
              if (field === 'options' && optionIndex !== undefined) {
                const newOptions = [...(mcq.options as string[])];
                newOptions[optionIndex] = value as string;
                return { ...mcq, options: newOptions };
              }
              return { ...mcq, [field]: value };
            }
            return mcq;
          });
          return { ...lq, mcqs: newMcqs };
        }
        return lq;
      })
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          try {
            const questions: MCQQuestion[] = [];

            if (file.name.endsWith('.csv')) {
              const csvData = e.target.result as string;
              const lines = csvData.split('\n');

              for (let i = 1; i < lines.length; i++) {
                const currentLine = lines[i].trim();
                if (currentLine) {
                  const values = currentLine.split(',');
                  if (values.length >= 6) { // Question, Option 1-4, Answer
                    questions.push({
                      id: Date.now().toString(),
                      question: values[0],
                      options: [values[1], values[2], values[3], values[4]],
                      correct: values[5],
                    });
                  }
                }
              }
            } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
              const workbook = XLSX.read(e.target.result, { type: 'binary' });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

              // Assuming first row is header, and data starts from second row
              for (let i = 1; i < json.length; i++) {
                const row = json[i];
                if (row.length >= 6) { // Question, Option 1-4, Answer
                  questions.push({
                    id: Date.now().toString(),
                    question: row[0],
                    options: [row[1], row[2], row[3], row[4]],
                    correct: row[5],
                  });
                }
              }
            }
            
            setMcqQuestions(questions);
            alert('Questions imported successfully!');
          } catch (error) {
            console.error('Error importing file:', error);
            alert('Failed to import questions from file.');
          }
        }
      };

      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        reader.readAsBinaryString(file);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar navItems={navItems} activePath={router.pathname} />
      <main className={styles.main}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ color: '#6366f1', fontWeight: 500, cursor: 'pointer' }} onClick={() => router.push('/admin/exams')}>Exams</span>
          <span style={{ color: '#6b7280' }}> / Create Exam</span>
        </div>
        <h1 className={styles.headerTitle}>Create Exam</h1>
        <div style={{ fontWeight: 600, fontSize: 18, margin: '32px 0 12px' }}>Question Type Selection</div>
        <div style={{ display: 'flex', gap: 32, borderBottom: '1px solid #e5e7eb', marginBottom: 32 }}>
          {questionTypes.map(type => (
            <div
              key={type.value}
              onClick={() => setActiveType(type.value)}
              style={{
                fontWeight: activeType === type.value ? 700 : 500,
                color: activeType === type.value ? '#111827' : '#6b7280',
                borderBottom: activeType === type.value ? '3px solid #6366f1' : 'none',
                padding: '0 0 12px 0',
                cursor: 'pointer',
                fontSize: 16,
              }}
            >
              {type.label}
            </div>
          ))}
        </div>
        <form style={{ maxWidth: 1024 }} onSubmit={e => {
          e.preventDefault();
          const examData = {
            type: activeType,
            mcqQuestions,
            readingQuestions,
            listeningQuestions,
            fillInTheBlankQuestions,
          };
          console.log('Exam Data:', examData);
          alert('Exam Saved! Check console for data.');
        }}>
          {activeType === 'mcq' && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <input
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleFileUpload}
                  style={{ marginBottom: 16, display: 'block' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    // Trigger file input click if needed, or just rely on onChange
                  }}
                  className={styles.addButton}
                  style={{ background: '#10b981', color: '#fff', marginBottom: 24 }}
                >
                  Import Questions from CSV
                </button>
              </div>
              {mcqQuestions.map((mcq, index) => (
                <MCQQuestionForm
                  key={mcq.id}
                  question={mcq}
                  questionIndex={index}
                  onUpdate={handleMcqChange}
                  onDelete={deleteMcqQuestion}
                  onAddOption={(id) => handleMcqChange(id, 'options', [...mcqQuestions.find(q => q.id === id)!.options, ''] as string[])}
                  onDeleteOption={(id, optionIndex) => handleMcqChange(id, 'options', mcqQuestions.find(q => q.id === id)!.options.filter((_, i) => i !== optionIndex) as string[], optionIndex)}
                />
              ))}
              <button type="button" className={styles.addButton} onClick={addMcqQuestion} style={{ background: '#6366f1', color: '#fff', marginBottom: 32 }}>Add another MCQ Question</button>
            </div>
          )}
          {activeType === 'reading' && (
            <div>
              {readingQuestions.map((reading, index) => (
                <ReadingQuestionForm
                  key={reading.id}
                  reading={reading}
                  index={index}
                  onUpdate={(id, field, value) => handleReadingChange(id, field as keyof ReadingQuestion, value as string | string[])}
                  onAddMcq={addReadingMcq}
                  onDelete={deleteReadingQuestion}
                  onDeleteMcq={deleteReadingMcq}
                  onMcqUpdate={handleReadingMcqUpdate}
                />
              ))}
              <button type="button" className={styles.addButton} onClick={addReadingQuestion} style={{ background: '#6366f1', color: '#fff', marginBottom: 32 }}>Add another Reading Question</button>
            </div>
          )}
          {activeType === 'listening' && (
            <div>
              {listeningQuestions.map((listening) => (
                <ListeningQuestionForm
                  key={listening.id}
                  listening={listening}
                  onUpdate={(id, field, value) => handleListeningChange(id, field as keyof ListeningQuestion, value as string | string[])}
                  onAddMcq={addListeningMcq}
                  onDelete={deleteListeningQuestion}
                  onDeleteMcq={deleteListeningMcq}
                  onMcqUpdate={handleListeningMcqUpdate}
                />
              ))}
              <button type="button" className={styles.addButton} onClick={addListeningQuestion} style={{ background: '#6366f1', color: '#fff', marginBottom: 32 }}>Add another Listening Question</button>
            </div>
          )}
          {activeType === 'fill_in_the_blank' && (
            <div>
              {fillInTheBlankQuestions.map((question) => (
                <FillInTheBlankQuestionForm
                  key={question.id}
                  question={question}
                  onUpdate={(id, field, value, answerIndex) => handleFillInTheBlankChange(id, field as keyof FillInTheBlankQuestion | 'answer', value as string | FillInTheBlankAnswer[], answerIndex)}
                  onAddAnswer={addFillInTheBlankAnswer}
                  onDelete={deleteFillInTheBlankQuestion}
                  onDeleteAnswer={deleteFillInTheBlankAnswer}
                />
              ))}
              <button type="button" className={styles.addButton} onClick={addFillInTheBlankQuestion} style={{ background: '#6366f1', color: '#fff', marginBottom: 32 }}>Add another Fill-in-the-Blank Question</button>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className={styles.addButton} style={{ minWidth: 140, fontSize: 16, background: '#e5e7eb', color: '#111827' }}>Save Exam</button>
          </div>
        </form>
      </main>
    </div>
  );
} 