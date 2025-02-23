import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Book, Lightbulb } from "lucide-react";

const Index = () => {
  const [studyConfig, setStudyConfig] = useState({
    topic: "",
    duration: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleStartStudying = async () => {
    if (!studyConfig.topic || !studyConfig.duration) {
      setError("Please fill in both topic and duration");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://backendstudy.onrender.com/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: studyConfig.topic,
          num_days: parseInt(studyConfig.duration),
          difficulty: "Medium"
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setStudyPlan(data.plan);
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://backendstudy.onrender.com/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: studyConfig.topic,
          num_questions: 5
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setQuizQuestions(data.questions);
      setSelectedAnswers({});
      setShowResults(false);
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, value) => {
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
      <main className="container max-w-4xl mx-auto space-y-6">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Study Plan Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="What topic would you like to study?"
              value={studyConfig.topic}
              onChange={(e) => setStudyConfig(prev => ({ ...prev, topic: e.target.value }))}
              className="mb-4"
            />
            <Input
              placeholder="How many days do you have?"
              type="number"
              value={studyConfig.duration}
              onChange={(e) => setStudyConfig(prev => ({ ...prev, duration: e.target.value }))}
              className="mb-4"
            />
            <Button 
              onClick={handleStartStudying} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Generating..." : "Create Study Plan"}
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </CardContent>
        </Card>

        {studyPlan && (
          <Card className="p-6">
            <CardHeader className="flex flex-row items-center gap-2">
              <Book className="w-5 h-5" />
              <CardTitle>Your Study Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: studyPlan }} />
              </div>
              <Button 
                onClick={handleGenerateQuiz} 
                disabled={loading}
                className="mt-4"
              >
                Generate Quiz
              </Button>
            </CardContent>
          </Card>
        )}

        {quizQuestions.length > 0 && (
          <Card className="p-6">
            <CardHeader className="flex flex-row items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              <CardTitle>Quiz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {quizQuestions.map((q, index) => (
                <div key={index} className="space-y-4">
                  <p className="font-medium">{index + 1}. {q.question}</p>
                  <RadioGroup
                    onValueChange={(value) => handleAnswerSelect(index, value)}
                    value={selectedAnswers[index]}
                  >
                    {q.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={optionIndex.toString()}
                          id={`q${index}-${optionIndex}`}
                        />
                        <Label htmlFor={`q${index}-${optionIndex}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {showResults && (
                    <p className={parseInt(selectedAnswers[index]) === q.correctAnswer ? 
                      "text-green-500" : "text-red-500"}>
                      {parseInt(selectedAnswers[index]) === q.correctAnswer ? 
                        "Correct!" : `Incorrect. The correct answer is: ${q.options[q.correctAnswer]}`}
                    </p>
                  )}
                </div>
              ))}
              <Button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                className="w-full mt-4"
              >
                Submit Quiz
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;
