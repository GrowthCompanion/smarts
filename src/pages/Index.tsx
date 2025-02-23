import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Book, Lightbulb } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface StudyConfig {
  topic: string;
  duration: string;
  lessons: string;
}

interface StudyDay {
  day: number;
  tasks: string[];
  quiz: boolean;
  review: boolean;
}

interface Resource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'tutorial';
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const Index = () => {
  const [studyConfig, setStudyConfig] = useState<StudyConfig>({
    topic: "",
    duration: "",
    lessons: "",
  });

  const [showDashboard, setShowDashboard] = useState(false);
  const [studyPlan, setStudyPlan] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleStartStudying = async () => {
    if (studyConfig.topic.trim() && studyConfig.duration.trim() && studyConfig.lessons.trim()) {
      // Fetch study plan from backend
      const response = await fetch("https://backendstudy.onrender.com/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: studyConfig.topic,
          num_days: parseInt(studyConfig.duration),  // Use the duration provided by the user
          difficulty: "Medium",  // You can make this dynamic as well
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStudyPlan({ days: data.plan });  // Update with actual structure
        setShowDashboard(true);
      } else {
        console.error("Failed to fetch study plan");
      }
    }
  };

  const handleGenerateQuiz = async () => {
    const response = await fetch("https://backendstudy.onrender.com/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: studyConfig.topic,
        quiz_type: "Multiple Choice",  // You can make this dynamic as well
        num_questions: 5,  // You can make this dynamic as well
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setQuizQuestions(data.questions);  // Update with actual structure
    } else {
      console.error("Failed to fetch quiz questions");
    }
  };

  const handleAnswerSelect = (questionIndex: number, value: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-secondary">
      <main className="container max-w-7xl mx-auto space-y-8">
        {!showDashboard ? (
          <div className="space-y-8 fade-in">
            <section className="text-center space-y-4 py-12">
              <div className="flex justify-center mb-8">
                <img
                  src="/lovable-uploads/9b502ecd-6762-4be7-815a-ba58aa69b2d5.png"
                  alt="SmartStudyBot.AI Logo"
                  className="h-24 mb-4"
                />
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Your AI-powered study assistant for mastering linear equations
              </p>
              <div className="max-w-md mx-auto space-y-4 pt-8">
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="What topic would you like to study?"
                    value={studyConfig.topic}
                    onChange={(e) => setStudyConfig({ ...studyConfig, topic: e.target.value })}
                    className="text-lg"
                  />
                  <Input
                    type="text"
                    placeholder="How long do you have to study? (e.g., 2 weeks)"
                    value={studyConfig.duration}
                    onChange={(e) => setStudyConfig({ ...studyConfig, duration: e.target.value })}
                    className="text-lg"
                  />
                  <Input
                    type="text"
                    placeholder="Which lessons do you need to cover?"
                    value={studyConfig.lessons}
                    onChange={(e) => setStudyConfig({ ...studyConfig, lessons: e.target.value })}
                    className="text-lg"
                  />
                </div>
                <Button
                  onClick={handleStartStudying}
                  className="w-full hover-lift bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  Create Study Plan
                </Button>
              </div>
            </section>
          </div>
        ) : (
          <Dashboard
            studyConfig={studyConfig}
            studyPlan={studyPlan}
            quizQuestions={quizQuestions}
            onGenerateQuiz={handleGenerateQuiz}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={handleAnswerSelect}
            showResults={showResults}
            onSubmitQuiz={handleSubmitQuiz}
          />
        )}
      </main>
    </div>
  );
};

const Dashboard = ({
  studyConfig,
  studyPlan,
  quizQuestions,
  onGenerateQuiz,
  selectedAnswers,
  onAnswerSelect,
  showResults,
  onSubmitQuiz,
}: {
  studyConfig: StudyConfig;
  studyPlan: any;
  quizQuestions: QuizQuestion[];
  onGenerateQuiz: () => void;
  selectedAnswers: Record<number, string>;
  onAnswerSelect: (questionIndex: number, value: string) => void;
  showResults: boolean;
  onSubmitQuiz: () => void;
}) => {
  return (
    <div className="space-y-6 fade-in">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Studying: {studyConfig.topic || "Linear Equations"}</h2>
          <p className="text-muted-foreground">Duration: {studyConfig.duration} • Lessons: {studyConfig.lessons}</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          New Study Plan
        </Button>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 glass-card">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Book className="w-5 h-5" /> Study Plan
            </h3>
            <div className="space-y-4">
              {studyPlan?.days?.map((day: StudyDay, index: number) => (
                <div key={index} className="p-4 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Day {day.day}</h4>
                  <ul className="space-y-2">
                    {day.tasks.map((task: string, taskIndex: number) => (
                      <li key={taskIndex} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 glass-card">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Lightbulb className="w-5 h-5" /> Quick Quiz
              </h3>
              <p className="text-muted-foreground">
                Test your knowledge on Linear Equations
              </p>
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={onGenerateQuiz}
              >
                Generate Quiz
              </Button>
            </div>
          </Card>

          <Card className="p-6 glass-card">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Practice Questions</h3>
              {quizQuestions.map((q, index) => (
                <div key={index} className="space-y-4">
                  <p className="font-medium">{index + 1}. {q.question}</p>
                  <RadioGroup
                    onValueChange={(value) => onAnswerSelect(index, value)}
                    value={selectedAnswers[index]}
                  >
                    {q.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={optionIndex.toString()} id={`q${index}-${optionIndex}`} />
                        <Label htmlFor={`q${index}-${optionIndex}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {showResults && (
                    <div className={`text-sm ${parseInt(selectedAnswers[index]) === q.correctAnswer ? 'text-green-500' : 'text-red-500'}`}>
                      {parseInt(selectedAnswers[index]) === q.correctAnswer ? 'Correct!' : `Incorrect. The correct answer is: ${q.options[q.correctAnswer]}`}
                    </div>
                  )}
                </div>
              ))}
              <Button 
                className="w-full" 
                onClick={onSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
              >
                Submit Answers
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
