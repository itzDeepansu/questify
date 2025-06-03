import prisma from "@/libs/prismaClient"

async function main() {
  // 1. Create Users
  const alice = await prisma.user.create({
    data: {
      username: 'alice',
      email: 'alice@example.com',
      passwordHash: 'hashed_pw_1',
    },
  });

  const bob = await prisma.user.create({
    data: {
      username: 'bob',
      email: 'bob@example.com',
      passwordHash: 'hashed_pw_2',
    },
  });

  // 2. Create Topics
  const tech = await prisma.topic.create({
    data: { name: 'Technology' },
  });

  const science = await prisma.topic.create({
    data: { name: 'Science' },
  });

  // 3. Create Questions
  const question1 = await prisma.question.create({
    data: {
      userId: alice.id,
      title: 'What is AI?',
      body: 'Can someone explain what Artificial Intelligence is?',
      topics: {
        create: [{ topicId: tech.id }],
      },
    },
  });

  const question2 = await prisma.question.create({
    data: {
      userId: bob.id,
      title: 'How does a rocket work?',
      body: 'Explain rocket propulsion basics.',
      topics: {
        create: [{ topicId: science.id }],
      },
    },
  });

  // 4. Create Answer
  const answer1 = await prisma.answer.create({
    data: {
      questionId: question1.id,
      userId: bob.id,
      body: 'AI is a branch of CS focused on machines simulating intelligence.',
    },
  });

  // 5. Create Discussion
  const discussion1 = await prisma.discussion.create({
    data: {
      questionId: question1.id,
      userId: bob.id,
      content: 'Interesting question! I want to know more too.',
    },
  });

  // 6. Add Upvotes
  await prisma.questionUpvote.create({
    data: {
      userId: bob.id,
      questionId: question1.id,
    },
  });

  await prisma.answerUpvote.create({
    data: {
      userId: alice.id,
      answerId: answer1.id,
    },
  });

  await prisma.discussionUpvote.create({
    data: {
      userId: alice.id,
      discussionId: discussion1.id,
    },
  });

  // 7. Add User Interests
  await prisma.userInterest.createMany({
    data: [
      { userId: alice.id, topicId: tech.id },
      { userId: bob.id, topicId: science.id },
    ],
  });

  // 8. Add Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: alice.id,
        content: 'Your question received an upvote!',
        read: false,
      },
      {
        userId: bob.id,
        content: 'You have a new answer!',
        read: false,
      },
    ],
  });

  console.log('✅ Seed data inserted');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
