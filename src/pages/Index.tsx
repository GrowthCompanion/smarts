import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Book, Lightbulb } from "lucide-react";

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

  // Hardcoded study plan and resources
  const studyPlan = {
    days: [
      {
        day: 1,
        tasks: ["Study Introduction to Computer Science", "Review key concepts", "Complete practice exercises"],
        quiz: true,
        review: true,
      },
      {
        day: 2,
        tasks: ["Study Data Structures", "Review key concepts", "Complete practice exercises"],
        quiz: true,
        review: true,
      },
      {
        day: 3,
        tasks: ["Study Algorithms", "Review key concepts", "Complete practice exercises"],
        quiz: true,
        review: true,
      },
      {
        day: 4,
        tasks: ["Study Operating Systems", "Review key concepts", "Complete practice exercises"],
        quiz: true,
        review: true,
      },
      {
        day: 5,
        tasks: ["Study Networking", "Review key concepts", "Complete practice exercises"],
        quiz: true,
        review: true,
      },
    ],
  };

  const resources = [
    {
      title: "Introduction to Computer Science",
      url: "https://example.com/intro-to-cs",
      type: 'article',
    },
    {
      title: "Data Structures Tutorial",
      url: "https://example.com/data-structures",
      type: 'video',
    },
    {
      title: "Algorithms Explained",
      url: "https://example.com/algorithms",
      type: 'article',
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
                Your AI-powered study assistant for personalized learning and exam preparation
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
  const durationInDays = parseInt(studyConfig.duration);
  const lessonsList = studyConfig.lessons.split(',').map(lesson => lesson.trim());

  return (
    <div className="space-y-6 fade-in">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Studying: {studyConfig.topic}</h2>
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

        <Card className="p-6 glass-card">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Lightbulb className="w-5 h-5" /> Quick Quiz
            </h3>
            <p className="text-muted-foreground">
              Test your knowledge on {lessonsList[0]}
            </p>
            <Button className="w-full bg-primary hover:bg-primary/90">Start Quiz</Button>
          </div>
        </Card>
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
