import { Task, Treatment } from '../database/types';

interface TaskGenerationConfig {
  treatment: Treatment;
  generateForMonths?: number; // How many months ahead to generate tasks
}

type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'yearly';

function parseFrequency(frequency: string): { pattern: RecurrencePattern; interval: number } {
  const frequencyLower = frequency.toLowerCase();
  
  if (frequencyLower.includes('daily') || frequencyLower.includes('day')) {
    const match = frequencyLower.match(/(\d+)/);
    return {
      pattern: 'daily',
      interval: match ? parseInt(match[1]) : 1
    };
  }
  
  if (frequencyLower.includes('weekly') || frequencyLower.includes('week')) {
    const match = frequencyLower.match(/(\d+)/);
    return {
      pattern: 'weekly',
      interval: match ? parseInt(match[1]) : 1
    };
  }
  
  if (frequencyLower.includes('monthly') || frequencyLower.includes('month')) {
    const match = frequencyLower.match(/(\d+)/);
    return {
      pattern: 'monthly',
      interval: match ? parseInt(match[1]) : 1
    };
  }
  
  if (frequencyLower.includes('twice daily')) {
    return {
      pattern: 'daily',
      interval: 1/2
    };
  }
  
  // Default to daily if we can't parse the frequency
  return {
    pattern: 'daily',
    interval: 1
  };
}

export function generateTasksFromTreatment({ treatment, generateForMonths = 3 }: TaskGenerationConfig): Omit<Task, 'id'>[] {
  const { pattern, interval } = parseFrequency(treatment.frequency);
  
  const startDate = new Date(treatment.startDate);
  const endDate = treatment.endDate 
    ? new Date(treatment.endDate)
    : new Date(startDate.getTime() + (generateForMonths * 30 * 24 * 60 * 60 * 1000));
  
  const tasks: Omit<Task, 'id'>[] = [];
  let currentDate = startDate;
  
  while (currentDate <= endDate) {
    // Create task for current date
    tasks.push({
      petId: treatment.petId,
      title: `${treatment.name} - ${treatment.dosage}`,
      type: 'medication',
      dueDate: currentDate.toISOString(),
      isComplete: false,
      notes: `Treatment: ${treatment.dosage}`,
      recurring: true,
      recurrencePattern: pattern,
      recurrenceInterval: interval,
      linkedTreatmentId: treatment.id,
      nextDueDate: currentDate.toISOString()
    });
    
    // Calculate next date based on pattern and interval
    switch (pattern) {
      case 'daily':
        if (interval === 1/2) { // Twice daily
          // Add 12 hours for the second daily dose
          const secondDose = new Date(currentDate.getTime() + (12 * 60 * 60 * 1000));
          if (secondDose <= endDate) {
            tasks.push({
              petId: treatment.petId,
              title: `${treatment.name} - ${treatment.dosage} (Evening)`,
              type: 'medication',
              dueDate: secondDose.toISOString(),
              isComplete: false,
              notes: `Treatment: ${treatment.dosage}`,
              recurring: true,
              recurrencePattern: pattern,
              recurrenceInterval: interval,
              linkedTreatmentId: treatment.id,
              nextDueDate: secondDose.toISOString()
            });
          }
          currentDate = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000));
        } else {
          currentDate = new Date(currentDate.getTime() + (interval * 24 * 60 * 60 * 1000));
        }
        break;
        
      case 'weekly':
        currentDate = new Date(currentDate.getTime() + (interval * 7 * 24 * 60 * 60 * 1000));
        break;
        
      case 'monthly':
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + interval, currentDate.getDate());
        break;
        
      case 'yearly':
        currentDate = new Date(currentDate.getFullYear() + interval, currentDate.getMonth(), currentDate.getDate());
        break;
    }
  }
  
  return tasks;
} 