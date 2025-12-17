// apps/platform/app/api/seed/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/db/connect';
import * as schema from '~/db/schema';

const houses = [
  { name: 'Gryffindor', description: 'Brave, courageous, and chivalrous' },
  { name: 'Slytherin', description: 'Ambitious, cunning, and resourceful' },
  { name: 'Ravenclaw', description: 'Wise, intelligent, and creative' },
  { name: 'Hufflepuff', description: 'Loyal, patient, and fair' },
];

const questions = [
  { id: 1, text: 'Which quality do you value most?' },
  { id: 2, text: 'What kind of magical creature would you want as a pet?' },
  { id: 3, text: 'Where would you rather spend your free time?' },
  { id: 4, text: 'What is your favorite subject?' },
];

const answers = [
  // Question 1
  { questionId: 1, text: 'Bravery', house: 'Gryffindor', score: 3 },
  { questionId: 1, text: 'Ambition', house: 'Slytherin', score: 3 },
  { questionId: 1, text: 'Wisdom', house: 'Ravenclaw', score: 3 },
  { questionId: 1, text: 'Loyalty', house: 'Hufflepuff', score: 3 },
  // Question 2
  { questionId: 2, text: 'Phoenix', house: 'Gryffindor', score: 3 },
  { questionId: 2, text: 'Serpent', house: 'Slytherin', score: 3 },
  { questionId: 2, text: 'Eagle', house: 'Ravenclaw', score: 3 },
  { questionId: 2, text: 'Badger', house: 'Hufflepuff', score: 3 },
  // Question 3
  { questionId: 3, text: 'The common room', house: 'Gryffindor', score: 2 },
  { questionId: 3, text: 'The dungeons', house: 'Slytherin', score: 3 },
  { questionId: 3, text: 'The library', house: 'Ravenclaw', score: 3 },
  { questionId: 3, text: 'The kitchens', house: 'Hufflepuff', score: 2 },
  // Question 4
  { questionId: 4, text: 'Defense Against the Dark Arts', house: 'Gryffindor', score: 3 },
  { questionId: 4, text: 'Potions', house: 'Slytherin', score: 3 },
  { questionId: 4, text: 'Charms', house: 'Ravenclaw', score: 2 },
  { questionId: 4, text: 'Herbology', house: 'Hufflepuff', score: 3 },
];

export async function GET() {
  try {
    await db.insert(schema.houses).values(houses);
    await db.insert(schema.questions).values(questions);
    await db.insert(schema.answers).values(answers);

    return NextResponse.json({ message: 'Database seeded successfully!' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
