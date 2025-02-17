
export async function generateStudyPlan(config: {
  topic: string;
  duration: string;
  lessons: string;
}) {
  const durationInDays = parseInt(config.duration);
  const lessonsList = config.lessons.split(',').map(lesson => lesson.trim());
  
  // Calculate lessons per day
  const lessonsPerDay = Math.ceil(lessonsList.length / durationInDays);
  
  const days = Array.from({ length: durationInDays }, (_, i) => {
    const dayLessons = lessonsList.slice(i * lessonsPerDay, (i + 1) * lessonsPerDay);
    return {
      day: i + 1,
      tasks: [
        `Study ${dayLessons.join(', ')}`,
        'Review key concepts',
        'Complete practice exercises',
        dayLessons.length > 0 ? 'Take quiz on covered topics' : 'General review',
      ],
      quiz: true,
      review: true,
    };
  });

  return { days };
}

export async function fetchResources(config: {
  topic: string;
  lessons: string;
}) {
  const lessonsList = config.lessons.split(',').map(lesson => lesson.trim());
  
  // Fetch resources for each lesson
  const resources = await Promise.all(
    lessonsList.map(async (lesson) => {
      const searchQuery = `${config.topic} ${lesson} tutorial`;
      
      // Use Serper API to search for resources
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': process.env.SERPER_API_KEY || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: searchQuery,
          num: 3,
        }),
      });

      const data = await response.json();
      
      return data.organic.map((result: any) => ({
        title: result.title,
        url: result.link,
        type: result.link.includes('youtube.com') ? 'video' : 'article',
      }));
    })
  );

  return resources.flat().slice(0, 6);
}
