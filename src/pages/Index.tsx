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

  const handleStartStudying = () => {
    if (studyConfig.topic.trim() && studyConfig.duration.trim() && studyConfig.lessons.trim()) {
      setShowDashboard(true);
    }
  };

  // Updated study plan for linear equations
  const studyPlan = {
    days: [
      {
        day: 1,
        tasks: ["Introduction to Linear Equations", "Understanding Slope-Intercept Form (y = mx + b)", "Practice identifying slopes and y-intercepts"],
        quiz: true,
        review: true,
      },
      {
        day: 2,
        tasks: ["Point-Slope Form of Linear Equations", "Converting between forms", "Graphing linear equations"],
        quiz: true,
        review: true,
      },
      {
        day: 3,
        tasks: ["Systems of Linear Equations", "Solving by substitution", "Solving by elimination"],
        quiz: true,
        review: true,
      },
      {
        day: 4,
        tasks: ["Word Problems with Linear Equations", "Real-world applications", "Practice problem-solving"],
        quiz: true,
        review: true,
      },
      {
        day: 5,
        tasks: ["Advanced Linear Equation Concepts", "Parallel and perpendicular lines", "Review all concepts"],
        quiz: true,
        review: true,
      },
    ],
  };

  const resources = [
    {
      title: "Linear Equations Basics",
      url: "https://example.com/linear-equations",
      type: 'article',
    },
    {
      title: "Graphing Linear Equations",
      url: "https://example.com/graphing-linear",
      type: 'video',
    },
    {
      title: "Systems of Equations Tutorial",
      url: "https://example.com/systems",
      type: 'tutorial',
    },
  ];

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
          <Dashboard studyConfig={studyConfig} studyPlan={studyPlan} resources={resources} />
        )}
      </main>
    </div>
  );
};

const Dashboard = ({ studyConfig, studyPlan, resources }: { studyConfig: StudyConfig; studyPlan: any; resources: Resource[] }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const quizQuestions: QuizQuestion[] = [
    {
      question: "What is the slope in the equation y = 3x + 4?",
      options: ["4", "3", "0", "-3"],
      correctAnswer: 1
    },
    {
      question: "Which form of a linear equation is y = mx + b?",
      options: ["Point-slope form", "Standard form", "Slope-intercept form", "General form"],
      correctAnswer: 2
    },
    {
      question: "In the equation 2x + 3y = 12, what is the y-intercept?",
      options: ["4", "12", "2", "3"],
      correctAnswer: 0
    }
  ];

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
              {studyPlan.days.map((day: StudyDay, index: number) => (
                <div key={index} className="p-4 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Day {day.day}</h4>
                  <ul className="space-y-2">
                    {day.tasks.map((task, taskIndex) => (
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
                onClick={() => setShowResults(false)}
              >
                Start Quiz
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
                    onValueChange={(value) => handleAnswerSelect(index, value)}
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
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
              >
                Submit Answers
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6 glass-card">
        <h3 className="text-xl font-semibold mb-4">Learning Resources</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {resources.map((resource, index) => (
            <div key={index} className="p-4 bg-secondary rounded-lg">
              <h4 className="font-semibold">{resource.title}</h4>
              <p className="text-muted-foreground">{resource.type}</p>
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Visit Resource
              </a>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
export default Index;
