
import { PrismaClient } from "./generated/prisma/index.js"

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1️⃣ Create demo users
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      id: 'uid-alice2', // simulate Supabase UID
      email: 'alice2@example.com',
      name: 'Alice',
      avatarUrl: 'https://i.pravatar.cc/100?img=1',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      id: 'uid-bob2',
      email: 'bob2@example.com',
      name: 'Bob',
      avatarUrl: 'https://i.pravatar.cc/100?img=2',
    },
  })

  // 2️⃣ Create a project
  const project = await prisma.project.create({
    data: {
      name: 'AI Productivity Dashboard2',
      description: 'Demo project seeded automatically',
      ownerId: user1.id,
      members: {
        create: [
          { userId: user1.id, role: 'ADMIN' },
          { userId: user2.id, role: 'MEMBER' },
        ],
      },
    },
  })

  // 3️⃣ Create default lists
  const todoList = await prisma.list.create({
    data: { name: 'Todo', order: 1, projectId: project.id },
  })
  const inProgressList = await prisma.list.create({
    data: { name: 'In Progress', order: 2, projectId: project.id },
  })
  const doneList = await prisma.list.create({
    data: { name: 'Done', order: 3, projectId: project.id },
  })

  // 4️⃣ Create tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Build login screen',
      description: 'Implement Supabase email OTP login',
      order: 1,
      status: 'Todo',
      priority: 'MEDIUM',
      listId: todoList.id,
      projectId: project.id,
      createdById: user1.id,
      assignedToId: user2.id,
      comments: {
        create: [
          {
            content: 'Let’s use React Hook Form + Zod for validation',
            authorId: user1.id,
          },
        ],
      },
    },
  })

  const task2 = await prisma.task.create({
    data: {
      title: 'Implement Notification System',
      description: 'Real-time updates via Redis Pub/Sub',
      order: 2,
      status: 'In Progress',
      priority: 'HIGH',
      listId: inProgressList.id,
      projectId: project.id,
      createdById: user1.id,
      assignedToId: user1.id,
    },
  })

  // 5️⃣ Add subtasks
  await prisma.subtask.createMany({
    data: [
      { title: 'Setup Redis connection', order: 1, taskId: task2.id },
      { title: 'Integrate Socket.IO Gateway', order: 2, taskId: task2.id },
    ],
  })

  console.log('✅ Seeding complete!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    //@ts-ignore
    process.exit(1)
  })