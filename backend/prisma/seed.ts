import { PrismaClient, TaskPriority } from './generated/prisma/index.js';

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('🗑️  Clearing database...');
  // The order of deletion is important to avoid foreign key constraint violations
  await prisma.$transaction([
    prisma.comment.deleteMany(),
    prisma.subtask.deleteMany(),
    prisma.activityLog.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.task.deleteMany(),
    prisma.list.deleteMany(),
    prisma.projectMember.deleteMany(),
    prisma.project.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  console.log('🗑️  Database cleared.');
}

async function main() {
  await clearDatabase();

  console.log('🌱 Seeding database...');

  // 1️⃣ Create users, filling some nullable fields
  const alice = await prisma.user.create({
    data: {
      id: 'user_alice_01',
      email: 'alice@example.com',
      name: 'Alice',
      avatarUrl: 'https://i.pravatar.cc/150?u=alice',
      lastSeen: new Date(),
    },
  });

  const bob = await prisma.user.create({
    data: {
      id: 'user_bob_02',
      email: 'bob@example.com',
      name: 'Bob',
      avatarUrl: 'https://i.pravatar.cc/150?u=bob',
      meta: {
        timezone: 'America/New_York',
      },
    },
  });

  const charlie = await prisma.user.create({
    data: {
      id: 'user_charlie_03',
      email: 'charlie@example.com',
      name: 'Charlie',
      // avatarUrl is nullable
    },
  });

  // 2️⃣ Create projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Phoenix Project',
      description: 'A top-secret project to revolutionize the industry.',
      ownerId: alice.id,
      members: {
        create: [
          { userId: alice.id, role: 'ADMIN' },
          { userId: bob.id, role: 'MEMBER' },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Side Hustle',
      // description is nullable
      ownerId: bob.id,
      members: {
        create: [{ userId: bob.id, role: 'ADMIN' }],
      },
    },
  });

  // 3️⃣ Create lists for the first project
  const p1_todo = await prisma.list.create({
    data: { name: 'Backlog', order: 1, projectId: project1.id },
  });
  const p1_inProgress = await prisma.list.create({
    data: { name: 'In Progress', order: 2, projectId: project1.id },
  });
  const p1_done = await prisma.list.create({
    data: { name: 'Done', order: 3, projectId: project1.id },
  });

  // 4️⃣ Create tasks with nullable fields
  const task1 = await prisma.task.create({
    data: {
      title: 'Design the core architecture',
      description: 'Define microservices, database schema, and communication protocols.',
      order: 1,
      status: 'Done',
      priority: TaskPriority.URGENT,
      dueDate: new Date('2024-08-15T23:59:59Z'),
      listId: p1_done.id,
      projectId: project1.id,
      createdById: alice.id,
      assignedToId: bob.id, // assignedToId is filled
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Develop user authentication service',
      description: 'Use JWT for authentication and authorization.',
      order: 1,
      status: 'In Progress',
      priority: TaskPriority.HIGH,
      listId: p1_inProgress.id,
      projectId: project1.id,
      createdById: alice.id,
      assignedToId: bob.id,
      // dueDate is nullable
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Set up CI/CD pipeline',
      // description is nullable
      order: 2,
      status: 'Backlog',
      priority: TaskPriority.MEDIUM,
      listId: p1_todo.id,
      projectId: project1.id,
      createdById: bob.id,
      // assignedToId is nullable
    },
  });

  // 5️⃣ Add subtasks with nullable assignee
  await prisma.subtask.createMany({
    data: [
      { title: 'Choose JWT library', order: 1, taskId: task2.id, isDone: true, assigneeId: bob.id },
      { title: 'Implement token generation endpoint', order: 2, taskId: task2.id, assigneeId: bob.id },
      { title: 'Implement token validation middleware', order: 3, taskId: task2.id }, // assigneeId is nullable
    ],
  });

  // 6️⃣ Add comments
  await prisma.comment.create({
    data: {
      content: "Let's use `jsonwebtoken` for Node.js.",
      taskId: task2.id,
      authorId: alice.id,
    },
  });

  // 7️⃣ Create notifications and activity logs with nullable metadata
  await prisma.notification.create({
    data: {
      type: 'TASK_ASSIGNED',
      message: `You were assigned a new task: "${task1.title}"`,
      userId: bob.id,
      meta: { taskId: task1.id },
    },
  });

  await prisma.activityLog.create({
    data: {
      action: 'CREATE',
      entityType: 'PROJECT',
      entityId: project1.id,
      metadata: { projectName: project1.name },
      projectId: project1.id,
      userId: alice.id,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: 'CREATE',
      entityType: 'TASK',
      entityId: task3.id,
      // metadata is nullable
      projectId: project1.id,
      userId: bob.id,
    },
  });

  console.log('✅ Seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });